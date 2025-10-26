create table "billing_plans" (
  "id"    bigint generated always as identity,
  "name"  varchar(32) not null check (length("name") >= 3),
  "price" numeric(10, 2)
);

alter table "billing_plans" add constraint "pkBillingPlans" primary key ("id");
create unique index "akBillingPlanNames" on "billing_plans" ("name");

create table "billing_plan_info" (
  "id"              bigint generated always as identity,
  "billing_plan_id" bigint not null,
  "created_at"      timestamptz default current_timestamp,
  "ended_at"        timestamptz not null
);

alter table "billing_plan_info" add constraint "pkBillingPlanInfo" primary key ("id");
alter table "billing_plan_info" add constraint "fkBillingPlanInfoBillingPlanIdBillingPlansId"
  foreign key ("billing_plan_id") references "billing_plans" ("id");

create table "operators" (
  "id"           bigint generated always as identity,
  "label"        varchar(32) not null check (length("label") >= 3),
  "plan_info_id" bigint not null,
  "token"        varchar(36) NOT NULL,
  "public_key"   text NOT NULL,
  "created_at"   timestamptz default current_timestamp
);

alter table "operators" add constraint "pkOperators" primary key ("id");
alter table "operators" add constraint "fkOperatorsPlanInfoIdBillingPlanInfoId"
  foreign key ("plan_info_id") references "billing_plan_info" ("id");
create unique index "akOperatorsLabel" on "operators" ("label");
create unique index "akOperatorsToken" on "operators" ("token");

create table "panels" (
  "id"               bigint generated always as identity,
  "serial"           varchar(32) not null,
  "operator_id"      bigint not null,
  "software_version" varchar(32),
  "status"           smallint not null
);

alter table "panels" add constraint "pkPanels" primary key ("id");
create unique index "akPanelsSerial" on "panels" ("serial");
alter table "panels" add constraint "fkPanelsOperatorIdOperatorsId"
  foreign key ("operator_id") references "operators" ("id");

create table "users" (
  "id"         bigint generated always as identity,
  "label"      varchar(32) not null check (length("label") >= 3),
  "role"       smallint not null,
  "panel_id"   bigint not null,
  "created_at" timestamptz default current_timestamp
);

alter table "users" add constraint "pkUsers" primary key ("id");
alter table "users" add constraint "fkUsersPanelIdPanelsId"
  foreign key ("panel_id") references "panels" ("id");

create table "devices" (
  "id"        bigint generated always as identity,
  "panel_id"  bigint not null,
  "type"      smallint not null,
  "subtype"   smallint not null
);

alter table "devices" add constraint "pkDevices" primary key ("id");
alter table "devices" add constraint "fkUDevicesPanelIdPanelsId"
  foreign key ("panel_id") references "panels" ("id");
