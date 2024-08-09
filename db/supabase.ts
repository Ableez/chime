import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ibmqxijsjyrsksfscsqm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibXF4aWpzanlyc2tzZnNjc3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxMDA3NzcsImV4cCI6MjAzNzY3Njc3N30.k8N1ir8UJXNbB45b3vDqKemDFLuDtM7WNciY5uLhV6s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
