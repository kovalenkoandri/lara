import "dotenv/config";
module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      eas: {},

      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  };
};
