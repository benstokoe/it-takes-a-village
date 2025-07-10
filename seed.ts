/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed';
import { createClient } from '@supabase/supabase-js';
import { copycat, faker } from '@snaplet/copycat';

const main = async () => {
  const seed = await createSeedClient({
    dryRun: false,
    models: {
      profiles: {
        data: {
          avatar_url: ({ seed }) => faker.image.avatarGitHub(),
        },
      },
    },
  });

  try {
    const postgres = (await import('postgres')).default;
    const sql = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');

    await sql`TRUNCATE TABLE public.availability_responses CASCADE`;
    await sql`TRUNCATE TABLE public.availability_requests CASCADE`;
    await sql`TRUNCATE TABLE public.request_messages CASCADE`;
    await sql`TRUNCATE TABLE public.request_recipients CASCADE`;
    await sql`TRUNCATE TABLE public.group_members CASCADE`;
    await sql`TRUNCATE TABLE public.groups CASCADE`;
    await sql`TRUNCATE TABLE public.profiles CASCADE`;

    await sql`DELETE FROM auth.sessions`;
    await sql`DELETE FROM auth.identities`;
    await sql`DELETE FROM auth.users`;

    await sql`
      CREATE OR REPLACE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    await sql.end();
  } catch (error) {
    throw error;
  }

  // Use local development Supabase credentials
  const supabaseUrl = 'http://127.0.0.1:54321';
  const supabaseServiceRoleKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const PASSWORD = 'testuser';
  for (let i = 0; i < 5; i++) {
    const email = copycat.email(i).toLowerCase();
    const avatar = faker.image.avatarGitHub();
    const fullName = copycat.fullName(i);
    const userName = copycat.username(i);

    await supabase.auth.signUp({
      email,
      password: PASSWORD,
      options: {
        data: {
          avatar_url: avatar,
          full_name: fullName,
          user_name: userName,
        },
      },
    });
  }

  const { data: databaseProfiles } = await supabase.from('profiles').select();

  const profiles =
    databaseProfiles?.map((profile) => ({
      avatar_url: profile.avatar_url,
      id: profile.id,
      name: profile.name,
      username: profile.username,
    })) ?? [];

  await seed.availability_requests((x) => x(10), { connect: { profiles } });
  await seed.availability_responses((x) => x(10), { connect: { profiles } });
  await seed.group_members((x) => x(10), { connect: { profiles } });
  await seed.groups((x) => x(10), { connect: { profiles } });
  await seed.request_messages((x) => x(10), { connect: { profiles } });
  await seed.request_recipients((x) => x(10), { connect: { profiles } });

  process.exit();
};

main();
