/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("pendingAuthorDemand", (table) => {
    table.increments("id")
    table.dateTime("applicationDate").defaultTo(knex.fn.now())
    table.integer("userId").notNullable().unique()
    table.foreign("userId").references("id").inTable("users")
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable("pendingAuthorDemand")
}
