// Firebase configuration for API endpoints
export const getFirebaseConfig = () => {
  const isDev = import.meta.env.DEV;
  const projectId = 'jobai-33c94'; // Corrected Firebase project ID
  
  return {
    // Development URLs (localhost via proxy)
    dev: {
      emailApi: '/api/sendEmail',
      jobsApi: '/api/getJobs'
    },
    // Production URLs (Firebase Functions)
    prod: {
      emailApi: `https://us-central1-${projectId}.cloudfunctions.net/api/sendEmail`,
      jobsApi: `https://us-central1-${projectId}.cloudfunctions.net/api/getIndianJobs`
    },
    // Get current environment URLs
    current: isDev ? {
      emailApi: '/api/sendEmail',
      jobsApi: '/api/getJobs'
    } : {
      emailApi: `https://us-central1-${projectId}.cloudfunctions.net/api/sendEmail`,
      jobsApi: `https://us-central1-${projectId}.cloudfunctions.net/api/getIndianJobs`
    }
  };
};

export const firebaseConfig = getFirebaseConfig();
