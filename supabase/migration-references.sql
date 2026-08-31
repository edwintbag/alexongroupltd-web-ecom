-- Adds quotable reference numbers to quotes and bookings.
-- Orders already have one. Run this in the Supabase SQL editor.

alter table quotes   add column if not exists reference text;
alter table bookings add column if not exists reference text;

create index if not exists quotes_reference_idx   on quotes (reference);
create index if not exists bookings_reference_idx on bookings (reference);
