const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase project URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testUsers = [
  { email: 'sarah.johnson@email.com', password: 'password123', full_name: 'Sarah Johnson' },
  { email: 'mike.chen@email.com', password: 'password123', full_name: 'Mike Chen' },
  { email: 'emily.davis@email.com', password: 'password123', full_name: 'Emily Davis' },
  { email: 'james.wilson@email.com', password: 'password123', full_name: 'James Wilson' },
  { email: 'lisa.garcia@email.com', password: 'password123', full_name: 'Lisa Garcia' },
  { email: 'david.brown@email.com', password: 'password123', full_name: 'David Brown' },
  { email: 'anna.taylor@email.com', password: 'password123', full_name: 'Anna Taylor' },
  { email: 'robert.martinez@email.com', password: 'password123', full_name: 'Robert Martinez' },
  { email: 'jennifer.lee@email.com', password: 'password123', full_name: 'Jennifer Lee' },
  { email: 'thomas.anderson@email.com', password: 'password123', full_name: 'Thomas Anderson' },
];

async function createTestUsers() {
  console.log('Creating test users...');

  for (const user of testUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
          },
        },
      });

      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`Failed to create user ${user.email}:`, err);
    }
  }

  console.log('Finished creating users!');
}

createTestUsers();
