
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."request_type" AS ENUM (
    'childcare',
    'event_help',
    'emergency',
    'social_visit',
    'transportation',
    'general_support'
);

ALTER TYPE "public"."request_type" OWNER TO "postgres";

CREATE TYPE "public"."response_type" AS ENUM (
    'yes',
    'no',
    'maybe'
);

ALTER TYPE "public"."response_type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."generate_invite_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  code text;
begin
  code := upper(left(md5(random()::text), 6));
  while exists (select 1 from public.groups where invite_code = code) loop
    code := upper(left(md5(random()::text), 6));
  end loop;
  return code;
end;
$$;

ALTER FUNCTION "public"."generate_invite_code"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_invite_code"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if new.invite_code is null or new.invite_code = '' then
    new.invite_code := public.generate_invite_code();
  end if;
  return new;
end;
$$;

ALTER FUNCTION "public"."set_invite_code"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';
SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."availability_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "request_type" "public"."request_type" NOT NULL,
    "requested_date" "date" NOT NULL,
    "start_time" time without time zone,
    "end_time" time without time zone,
    "location" "text",
    "is_urgent" boolean DEFAULT false,
    "is_recurring" boolean DEFAULT false,
    "recurring_pattern" "jsonb",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "availability_requests_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'cancelled'::"text"])))
);

ALTER TABLE "public"."availability_requests" OWNER TO "postgres";

COMMENT ON TABLE "public"."availability_requests" IS 'Requests for help or support sent to group members with specific dates and details.';

CREATE TABLE IF NOT EXISTS "public"."availability_responses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "request_id" "uuid" NOT NULL,
    "responder_id" "uuid" NOT NULL,
    "response" "public"."response_type" NOT NULL,
    "notes" "text",
    "available_from" time without time zone,
    "available_until" time without time zone,
    "responded_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."availability_responses" OWNER TO "postgres";

COMMENT ON TABLE "public"."availability_responses" IS 'Group member responses to availability requests including their availability windows.';

CREATE TABLE IF NOT EXISTS "public"."group_members" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "relationship_label" "text" NOT NULL,
    "role" "text" DEFAULT 'member'::"text",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true,
    CONSTRAINT "group_members_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'member'::"text"])))
);

ALTER TABLE "public"."group_members" OWNER TO "postgres";

COMMENT ON TABLE "public"."group_members" IS 'Junction table linking users to groups with their relationship and role information.';

CREATE TABLE IF NOT EXISTS "public"."groups" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "invite_code" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."groups" OWNER TO "postgres";

COMMENT ON TABLE "public"."groups" IS 'Groups that coordinate availability requests among members.';

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "phone_number" "text",
    "timezone" "text" DEFAULT 'America/New_York'::"text",
    "notification_preferences" "jsonb" DEFAULT '{"sms": false, "push": true, "email": true}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

COMMENT ON TABLE "public"."profiles" IS 'User profiles extending auth.users with additional information and preferences for group coordination.';

CREATE TABLE IF NOT EXISTS "public"."request_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "request_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "message_text" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."request_messages" OWNER TO "postgres";

COMMENT ON TABLE "public"."request_messages" IS 'Chat messages associated with specific availability requests for coordination.';

CREATE TABLE IF NOT EXISTS "public"."request_recipients" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "request_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "sent_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."request_recipients" OWNER TO "postgres";

COMMENT ON TABLE "public"."request_recipients" IS 'Tracks which group members received specific availability requests.';

ALTER TABLE ONLY "public"."availability_requests"
    ADD CONSTRAINT "availability_requests_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."availability_responses"
    ADD CONSTRAINT "availability_responses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."availability_responses"
    ADD CONSTRAINT "availability_responses_request_id_responder_id_key" UNIQUE ("request_id", "responder_id");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_invite_code_key" UNIQUE ("invite_code");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_user_id_key" UNIQUE ("group_id", "user_id");

ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_messages"
    ADD CONSTRAINT "request_messages_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_recipients"
    ADD CONSTRAINT "request_recipients_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."request_recipients"
    ADD CONSTRAINT "request_recipients_request_id_recipient_id_key" UNIQUE ("request_id", "recipient_id");

CREATE INDEX "idx_availability_requests_created_by" ON "public"."availability_requests" USING "btree" ("created_by");

CREATE INDEX "idx_availability_requests_date" ON "public"."availability_requests" USING "btree" ("requested_date");

CREATE INDEX "idx_availability_requests_group_id" ON "public"."availability_requests" USING "btree" ("group_id");

CREATE INDEX "idx_availability_responses_request_id" ON "public"."availability_responses" USING "btree" ("request_id");

CREATE INDEX "idx_availability_responses_responder_id" ON "public"."availability_responses" USING "btree" ("responder_id");

CREATE INDEX "idx_group_members_group_id" ON "public"."group_members" USING "btree" ("group_id");

CREATE INDEX "idx_group_members_user_id" ON "public"."group_members" USING "btree" ("user_id");

CREATE INDEX "idx_request_messages_request_id" ON "public"."request_messages" USING "btree" ("request_id");

CREATE INDEX "idx_request_recipients_recipient_id" ON "public"."request_recipients" USING "btree" ("recipient_id");

CREATE INDEX "idx_request_recipients_request_id" ON "public"."request_recipients" USING "btree" ("request_id");

CREATE OR REPLACE TRIGGER "trigger_set_invite_code" BEFORE INSERT ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."set_invite_code"();

CREATE OR REPLACE TRIGGER "update_availability_requests_updated_at" BEFORE UPDATE ON "public"."availability_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_availability_responses_updated_at" BEFORE UPDATE ON "public"."availability_responses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_groups_updated_at" BEFORE UPDATE ON "public"."groups" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

ALTER TABLE ONLY "public"."availability_requests"
    ADD CONSTRAINT "availability_requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."availability_requests"
    ADD CONSTRAINT "availability_requests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."availability_responses"
    ADD CONSTRAINT "availability_responses_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."availability_requests"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."availability_responses"
    ADD CONSTRAINT "availability_responses_responder_id_fkey" FOREIGN KEY ("responder_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."groups"
    ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."group_members"
    ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."request_messages"
    ADD CONSTRAINT "request_messages_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."availability_requests"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."request_messages"
    ADD CONSTRAINT "request_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."request_recipients"
    ADD CONSTRAINT "request_recipients_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."request_recipients"
    ADD CONSTRAINT "request_recipients_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "public"."availability_requests"("id") ON DELETE CASCADE;

CREATE POLICY "Group admins can add members" ON "public"."group_members" FOR INSERT TO "authenticated" WITH CHECK (("group_id" IN ( SELECT "f"."id"
   FROM ("public"."groups" "f"
     JOIN "public"."group_members" "fm" ON (("f"."id" = "fm"."group_id")))
  WHERE (("fm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("fm"."role" = 'admin'::"text")))));

CREATE POLICY "Group admins can remove members" ON "public"."group_members" FOR DELETE TO "authenticated" USING (("group_id" IN ( SELECT "f"."id"
   FROM ("public"."groups" "f"
     JOIN "public"."group_members" "fm" ON (("f"."id" = "fm"."group_id")))
  WHERE (("fm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("fm"."role" = 'admin'::"text")))));

CREATE POLICY "Group admins can update groups" ON "public"."groups" FOR UPDATE TO "authenticated" USING (("id" IN ( SELECT "group_members"."group_id" AS "group_id"
   FROM "public"."group_members"
  WHERE (("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("group_members"."role" = 'admin'::"text"))))) WITH CHECK (("id" IN ( SELECT "group_members"."group_id" AS "group_id"
   FROM "public"."group_members"
  WHERE (("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("group_members"."role" = 'admin'::"text")))));

CREATE POLICY "Group admins can update members" ON "public"."group_members" FOR UPDATE TO "authenticated" USING (("group_id" IN ( SELECT "f"."id"
   FROM ("public"."groups" "f"
     JOIN "public"."group_members" "fm" ON (("f"."id" = "fm"."group_id")))
  WHERE (("fm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("fm"."role" = 'admin'::"text"))))) WITH CHECK (("group_id" IN ( SELECT "f"."id"
   FROM ("public"."groups" "f"
     JOIN "public"."group_members" "fm" ON (("f"."id" = "fm"."group_id")))
  WHERE (("fm"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("fm"."role" = 'admin'::"text")))));

CREATE POLICY "Group creators can create groups" ON "public"."groups" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Group members can create requests" ON "public"."availability_requests" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "created_by") AND ("group_id" IN ( SELECT "group_members"."group_id" AS "group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));

CREATE POLICY "Group members can send messages" ON "public"."request_messages" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "sender_id") AND ("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."group_id" IN ( SELECT "group_members"."group_id" AS "group_id"
           FROM "public"."group_members"
          WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))))));

CREATE POLICY "Group members can view group requests" ON "public"."availability_requests" FOR SELECT TO "authenticated" USING (("group_id" IN ( SELECT "group_members"."group_id" AS "group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Group members can view request messages" ON "public"."request_messages" FOR SELECT TO "authenticated" USING (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."group_id" IN ( SELECT "group_members"."group_id" AS "group_id"
           FROM "public"."group_members"
          WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));

CREATE POLICY "Group members can view responses in their group" ON "public"."availability_responses" FOR SELECT TO "authenticated" USING (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."group_id" IN ( SELECT "group_members"."group_id" AS "group_id"
           FROM "public"."group_members"
          WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));

CREATE POLICY "Group members can view their groups" ON "public"."groups" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "group_members"."group_id" AS "group_id"
   FROM "public"."group_members"
  WHERE ("group_members"."user_id" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Message senders can delete their messages" ON "public"."request_messages" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "sender_id"));

CREATE POLICY "Message senders can update their messages" ON "public"."request_messages" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "sender_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "sender_id"));

CREATE POLICY "Recipients can respond to requests" ON "public"."availability_responses" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "responder_id"));

CREATE POLICY "Recipients can view their requests" ON "public"."request_recipients" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "recipient_id"));

CREATE POLICY "Request creators can add recipients" ON "public"."request_recipients" FOR INSERT TO "authenticated" WITH CHECK (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."created_by" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Request creators can delete recipients" ON "public"."request_recipients" FOR DELETE TO "authenticated" USING (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."created_by" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Request creators can delete their requests" ON "public"."availability_requests" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Request creators can update recipients" ON "public"."request_recipients" FOR UPDATE TO "authenticated" USING (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."created_by" = ( SELECT "auth"."uid"() AS "uid"))))) WITH CHECK (("request_id" IN ( SELECT "availability_requests"."id"
   FROM "public"."availability_requests"
  WHERE ("availability_requests"."created_by" = ( SELECT "auth"."uid"() AS "uid")))));

CREATE POLICY "Request creators can update their requests" ON "public"."availability_requests" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "created_by")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "created_by"));

CREATE POLICY "Responders can delete their responses" ON "public"."availability_responses" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "responder_id"));

CREATE POLICY "Responders can update their responses" ON "public"."availability_responses" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "responder_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "responder_id"));

CREATE POLICY "Users can add themselves to groups" ON "public"."group_members" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Users can remove themselves from groups" ON "public"."group_members" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can update their own membership" ON "public"."group_members" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));

CREATE POLICY "Users can view group members where they belong" ON "public"."group_members" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR (EXISTS ( SELECT 1
   FROM "public"."group_members" "fm2"
  WHERE (("fm2"."group_id" = "group_members"."group_id") AND ("fm2"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));

CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_invite_code"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_invite_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_invite_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_invite_code"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

GRANT ALL ON TABLE "public"."availability_requests" TO "anon";
GRANT ALL ON TABLE "public"."availability_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."availability_requests" TO "service_role";

GRANT ALL ON TABLE "public"."availability_responses" TO "anon";
GRANT ALL ON TABLE "public"."availability_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."availability_responses" TO "service_role";

GRANT ALL ON TABLE "public"."group_members" TO "anon";
GRANT ALL ON TABLE "public"."group_members" TO "authenticated";
GRANT ALL ON TABLE "public"."group_members" TO "service_role";

GRANT ALL ON TABLE "public"."groups" TO "anon";
GRANT ALL ON TABLE "public"."groups" TO "authenticated";
GRANT ALL ON TABLE "public"."groups" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."request_messages" TO "anon";
GRANT ALL ON TABLE "public"."request_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."request_messages" TO "service_role";

GRANT ALL ON TABLE "public"."request_recipients" TO "anon";
GRANT ALL ON TABLE "public"."request_recipients" TO "authenticated";
GRANT ALL ON TABLE "public"."request_recipients" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

RESET ALL;
