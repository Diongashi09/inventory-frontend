import { ref } from 'vue';
import { useAxios } from '@/composables/useAxios';
import { useRouter } from 'vue-router'; // Import useRouter here

const user = ref(null);
const isAuthenticated = ref(false); // Set to false initially, initializeAuth will check localStorage
const isLoading = ref(false);
const errorMessage = ref(null);
const userRole = ref(null);

export function useAuth() {
  // Initialize useRouter inside the composable function, when it's called
  const router = useRouter();
  const { api } = useAxios();

  // Function to clear error messages
  const clearErrorMessage = () => {
    errorMessage.value = null;
  };

  // Function to set the authentication state and user data
  const setAuthState = (userData, token) => {
    user.value = userData;
    isAuthenticated.value = true;
    userRole.value = userData.role ? userData.role.name : null; // Ensure role name is extracted

    localStorage.setItem('authToken', token);
    if (userRole.value) {
      localStorage.setItem('userRole', userRole.value);
    } else {
      localStorage.removeItem('userRole');
    }
    console.log('setAuthState: isAuthenticated=', isAuthenticated.value, 'userRole=', userRole.value);
  };

  // Function to clear the authentication state
  const clearAuthState = () => {
    user.value = null;
    isAuthenticated.value = false;
    userRole.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    console.log('clearAuthState: Auth state cleared.');
  };

  // --- Authentication Functions (Laravel API calls) ---

  const register = async (name, email, password, password_confirmation, role_id) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation,
        role_id
      });
      // Backend returns 'access_token' and 'user' directly at the root
      setAuthState(response.data.user, response.data.access_token);
      console.log('Register successful:', response.data.user.email);
    } catch (error) {
      console.error("Registration error:", error);
      errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email, password) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/login', { email, password });
      // Backend returns 'access_token' and 'user' directly at the root
      setAuthState(response.data.user, response.data.access_token);
      console.log('Login successful for:', response.data.user.email);
    } catch (error) {
      console.error("Login error:", error);
      errorMessage.value = error.response?.data?.message || 'Login failed. Please check your credentials.';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      await api.post('/logout');
      console.log('Backend logout success.');
    } catch (error) {
      console.error("Logout error (client-side state still cleared):", error);
      errorMessage.value = error.response?.data?.message || 'Logout failed.';
    } finally {
      clearAuthState();
      isLoading.value = false;
      router.push({ name: 'Login' });
    }
  };

  const sendPasswordReset = async (email) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/forgot-password', { email });
      errorMessage.value = response.data.message || "Password reset link sent! Check your inbox.";
    } catch (error) {
      console.error("Password reset error:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to send password reset link.';
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (email, password, password_confirmation, token) => {
    isLoading.value = true;
    clearErrorMessage();
    try {
      const response = await api.post('/reset-password', {
        email,
        password,
        password_confirmation,
        token
      });
      errorMessage.value = response.data.message || "Your password has been reset successfully!";
    } catch (error) {
      console.error("Password reset error:", error);
      errorMessage.value = error.response?.data?.message || 'Failed to reset password.';
    } finally {
      isLoading.value = false;
    }
  };

  const initializeAuth = async () => {
    console.log('initializeAuth called on app start.');
    const token = localStorage.getItem('authToken');
    console.log('initializeAuth: Token from localStorage:', token ? 'Found' : 'Not Found');

    if (token) {
      // If isAuthenticated is already true and user data exists, no need to re-fetch on every re-render
      if (isAuthenticated.value && user.value) {
        console.log('initializeAuth: User already authenticated and data present. Skipping API fetch.');
        return;
      }

      isLoading.value = true;
      try {
        console.log('initializeAuth: Attempting to fetch user data with token from /user endpoint...');
        // The useAxios interceptor automatically adds the Authorization header
        const response = await api.get('/user');
        console.log('initializeAuth: /user endpoint response received.');
        // Backend's /user endpoint returns the User model directly, not nested
        setAuthState(response.data, token);
        console.log('initializeAuth: Auth state re-established successfully. Current role:', userRole.value);
      } catch (error) {
        console.error("initializeAuth Error: Token validation failed or /user endpoint error (likely expired/invalid token):", error.response?.status, error.response?.data || error.message);
        clearAuthState();
        console.log('initializeAuth: Auth state cleared due to validation error.');
      } finally {
        isLoading.value = false;
        console.log('initializeAuth: Finished. Final isAuthenticated:', isAuthenticated.value);
      }
    } else {
      console.log('initializeAuth: No authToken found in localStorage. Not performing API validation.');
      clearAuthState(); // Ensure state is clear if no token
    }
  };


  // --- Role-based Access Control ---
  const hasRole = (role) => {
    console.log('hasRole check: Current userRole =', userRole.value, 'Checking for role =', role);
    return userRole.value === role;
  };

  const hasAnyRole = (roles) => {
    console.log('hasAnyRole check: Current isAuthenticated =', isAuthenticated.value, 'Current userRole =', userRole.value, 'Required roles =', roles);
    if (!roles || roles.length === 0) return true;
    return isAuthenticated.value && roles.includes(userRole.value);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    errorMessage,
    userRole,
    clearErrorMessage,
    register,
    login,
    logout,
    sendPasswordReset,
    resetPassword,
    initializeAuth,
    hasRole,
    hasAnyRole,
  };
}



//     const token = ref(localStorage.getItem('token') || '')
//     const user = ref(JSON.parse(localStorage.getItem('user')) || null)

//     if(token.value){
//         api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
//     }

//     const isAuthenticated = computed(() => !!token.value && !!user.value)
//     const userRole = computed(() => user.value?.role?.name || null);

//     const hasRole = (roleName) => {
//         return userRole.value && userRole.value.toLowerCase() === roleName.toLowerCase();
//     }

//     const hasAnyRole = (roleNames) => {
//         return userRole.value && roleNames.some(role => userRole.value.toLowerCase() === role.toLowerCase());
//     }

//     const saveSession = (tok,usr) => {
//         token.value = tok
//         user.value = usr
//         localStorage.setItem('token',tok)
//         localStorage.setItem('user',JSON.stringify(usr))
//         api.defaults.headers.common['Authorization'] = `Bearer ${tok}`
//     }

//     const clearSession = () => {
//         token.value = ''
//         user.value = null
//         localStorage.removeItem('token')
//         localStorage.removeItem('user')
//         delete api.defaults.headers.common['Authorization']
//     }

//     async function login(payload){
//         try {
//             const res = await api.post('/login',payload)
//             saveSession(res.data.access_token,res.data.user)
//         } catch (error) {
//             console.log('Login failed:',error);
//             throw error
//         }
//     }

//     async function register(payload) {
//     try {
//       const res = await api.post('/register', payload)
//       saveSession(res.data.access_token, res.data.user)
//     } catch (error) {
//       console.error('Registration failed:', error)
//       throw error
//     }
//   }

//   async function logout() {
//     try {
//       await api.post('/logout')
//       clearSession()
//     } catch (error) {
//       console.error('Logout failed:', error)
//       throw error
//     }
//   }

//   async function forgotPassword(payload) {
//     try {
//       const res = await api.post('/forgot-password', payload)
//       console.log('Reset email sent')
//       return res.data
//     } catch (error) {
//       console.error('Forgot password failed:', error)
//       throw error
//     }
//   }

//   async function resetPassword(payload) {
//     try {
//       const res = await api.post('/reset-password', payload)
//       return res.data
//     } catch (error) {
//       console.error('Reset password failed:', error)
//       throw error
//    } 
//  }


  // return {
  //       token,
  //       user,
  //       isAuthenticated,
  //       userRole,
  //       hasRole,
  //       hasAnyRole,
  //       login,
  //       register,
  //       logout,
  //       forgotPassword,
  //       resetPassword,
  //       saveSession,
  //       clearSession,
  //   };
