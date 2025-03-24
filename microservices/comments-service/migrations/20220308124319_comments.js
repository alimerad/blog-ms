/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("comments", (table) => {
    table.increments("id")
    table.text("content").notNullable()
    table.dateTime("postedAt").defaultTo(knex.fn.now())
    table.integer("userId").notNullable()
    table.integer("postId").notNullable()
    table
      .foreign("userId")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
    table
      .foreign("postId")
      .references("id")
      .inTable("posts")
      .onUpdate("CASCADE")
      .onDelete("CASCADE")
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable("comments")
}
