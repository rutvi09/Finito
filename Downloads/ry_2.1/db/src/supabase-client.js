import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qzkvsocquaqgigfflzul.supabase.co";
const supabaseKey = "sb_publishable_3bzv59oHGYFynbnSjGEPWA_vFfyFFxQ";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;