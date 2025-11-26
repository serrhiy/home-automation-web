create table "billingPlans" (
  "id"    bigint generated always as identity,
  "name"  varchar(32) not null check (length("name") >= 3),
  "price" numeric(10, 2) not null
);

alter table "billingPlans" add constraint "pkBillingPlans" primary key ("id");
create unique index "akBillingPlanNames" on "billingPlans" ("name");

create table "billingPlanInfo" (
  "id"            bigint generated always as identity,
  "billingPlanId" bigint not null,
  "createdAt"     timestamptz default current_timestamp,
  "endedAt"       timestamptz not null
);

alter table "billingPlanInfo" add constraint "pkBillingPlanInfo" primary key ("id");
alter table "billingPlanInfo" add constraint "fkBillingPlanInfoBillingPlanIdBillingPlansId"
  foreign key ("billingPlanId") references "billingPlans" ("id");

create table "operators" (
  "id"         bigint generated always as identity,
  "label"      varchar(32) not null check (length("label") >= 3),
  "planInfoId" bigint not null,
  "token"      varchar(36) NOT NULL,
  "publicKey"  text NOT NULL,
  "createdAt"  timestamptz default current_timestamp
);

alter table "operators" add constraint "pkOperators" primary key ("id");
alter table "operators" add constraint "fkOperatorsPlanInfoIdBillingPlanInfoId"
  foreign key ("planInfoId") references "billingPlanInfo" ("id");
create unique index "akOperatorsLabel" on "operators" ("label");
create unique index "akOperatorsToken" on "operators" ("token");

create table "panels" (
  "id"              bigint generated always as identity,
  "serial"          varchar(32) not null,
  "operatorId"      bigint not null,
  "softwareVersion" varchar(32),
  "status"          smallint not null
);

alter table "panels" add constraint "pkPanels" primary key ("id");
create unique index "akPanelsSerial" on "panels" ("serial");
alter table "panels" add constraint "fkPanelsOperatorIdOperatorsId"
  foreign key ("operatorId") references "operators" ("id");

create table "users" (
  "id"        bigint generated always as identity,
  "label"     varchar(32) not null check (length("label") >= 3),
  "role"      smallint not null,
  "panelId"   bigint not null,
  "createdAt" timestamptz default current_timestamp
);

alter table "users" add constraint "pkUsers" primary key ("id");
alter table "users" add constraint "fkUsersPanelIdPanelsId"
  foreign key ("panelId") references "panels" ("id");

create table "devices" (
  "id"      bigint generated always as identity,
  "panelId" bigint not null,
  "type"    smallint not null,
  "subtype" smallint not null
);

alter table "devices" add constraint "pkDevices" primary key ("id");
alter table "devices" add constraint "fkUDevicesPanelIdPanelsId"
  foreign key ("panelId") references "panels" ("id");
