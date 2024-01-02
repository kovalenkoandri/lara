import "dotenv/config";
module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      eas: {
        projectId: "9b09ed7a-525a-4896-81f2-7004336a3638",
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  };
};
