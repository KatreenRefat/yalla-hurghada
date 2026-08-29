import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://lwupxuekvapszejjxevt.supabase.co";

const supabaseKey =
  "sb_publishable_3-y49titTj_GUXwimhxwkQ_VvnSvRf8";

export const supabase =
  createClient(supabaseUrl, supabaseKey);
