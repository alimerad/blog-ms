import hashPassword from "../src/middleware/hashPassword.js"

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("rights", (table) => {
    table.increments("id")
    table.text("label").notNullable().unique()
  })
  await knex
    .insert([
      { label: "reader" },
      { label: "author" },
      { label: "admin" },
      { label: "banned" },
    ])
    .into("rights")

  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("email").notNullable().unique()
    table.text("displayName").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.integer("rightId").defaultTo(1)
    table.foreign("rightId").references("id").inTable("rights")
  })

  const [passwordHash, passwordSalt] = hashPassword("azerty93")

  await knex
    .insert({
      email: "ad@min.com",
      displayName: "Aretuza",
      passwordHash,
      passwordSalt,
      rightId: 3,
    })
    .into("users")
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTableIfExists("users")
  await knex.schema.dropTableIfExists("rights")
}
