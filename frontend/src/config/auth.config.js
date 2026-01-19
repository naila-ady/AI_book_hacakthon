// Auth configuration for Better Auth
// Direct API calls to match backend implementation
// Export authentication functions that call backend API
export const signIn = {
  email: async ({ email, password }) => {
    const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
    const response = await fetch(`${apiUrl}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token from the response
      if (data.session && data.session.token) {
        localStorage.setItem('better_auth_token', data.session.token);
      }
      return data;
    } else {
      throw new Error(data.detail || 'Login failed');
    }
  }
};

export const signUp = {
  email: async ({ email, password, name }) => {
    const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
    const response = await fetch(`${apiUrl}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name: name || '' }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store the token from the response
      if (data.session && data.session.token) {
        localStorage.setItem('better_auth_token', data.session.token);
      }
      return data;
    } else {
      throw new Error(data.detail || 'Registration failed');
    }
  }
};

export const signOut = async () => {
  // Clear the stored token
  localStorage.removeItem('better_auth_token');
  // Call backend sign-out endpoint
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    await fetch(`${apiUrl}/api/auth/sign-out`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Sign out error:', error);
  }
  return { success: true };
};

// Export the client instance placeholder
export const authClient = null;

// Simple function to check session manually
export const checkSession = async () => {
  try {
    const token = localStorage.getItem('better_auth_token') || '';

    if (!token) {
      console.log('No token found in localStorage');
      return { data: null, isLoading: false };
    }

    // Check session with backend
const apiUrl = 'https://nkamdar-ai-book-hackathon.hf.space'; // Replace with your Hugging Face Space URL
const response = await fetch(`${apiUrl}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Session check successful:', data);
      return { data, isLoading: false };
    } else {
      console.log('Session check failed with status:', response.status);
      // Clear the token if session check fails
      localStorage.removeItem('better_auth_token');
      return { data: null, isLoading: false };
    }
  } catch (error) {
    console.error('Session check failed:', error);
    // Clear the token if there's an error
    localStorage.removeItem('better_auth_token');
    return { data: null, isLoading: false };
  }
};

// Export a useSession hook that works with our implementation
export const useSession = () => {
  // This is just a placeholder since we're using AuthContext instead
  return { session: null, loading: false };
};