/* NO-OP migration
  This migration previously attempted to create or alter `PromoReferentiel` and add
  foreign key constraints which are already created by earlier migrations. To avoid
  duplicate-constraint errors during apply in the shadow DB, this migration was
  converted to a no-op for local development. If you need to make schema changes,
  create a new migration with the desired operations.
*/

-- Migration intentionally left empty to avoid duplicate FK errors in local dev.
