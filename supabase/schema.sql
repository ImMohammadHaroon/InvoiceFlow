-- Sledge Invoice Approval Desk schema
-- Run this in the Supabase SQL editor before seeding.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type invoice_status as enum (
      'processing',
      'needs_review',
      'approved',
      'rejected'
    );
  end if;
end $$;

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  vendor_name text not null,
  invoice_number text not null,
  invoice_date date not null,
  due_date date,
  subtotal numeric(12,2) not null,
  tax numeric(12,2) default 0,
  total numeric(12,2) not null,
  status invoice_status not null default 'processing',
  is_duplicate boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null
    references invoices(id)
    on delete cascade,
  description text not null,
  quantity numeric(10,2) not null,
  unit_price numeric(12,2) not null,
  amount numeric(12,2) not null,
  created_at timestamptz default now()
);

create table if not exists invoice_notes (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null
    references invoices(id)
    on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists invoices_status_idx on invoices(status);
create index if not exists invoices_invoice_number_idx on invoices(invoice_number);
create index if not exists invoice_items_invoice_id_idx on invoice_items(invoice_id);
create index if not exists invoice_notes_invoice_id_idx on invoice_notes(invoice_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists invoices_set_updated_at on invoices;
create trigger invoices_set_updated_at
  before update on invoices
  for each row
  execute function set_updated_at();

alter table invoices enable row level security;
alter table invoice_items enable row level security;
alter table invoice_notes enable row level security;

-- No public policies: all access goes through the Next.js API with the service role key.
