import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export interface user {
	id: number
	name: string
	recent: number
}

export const user = sqliteTable("user", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text(),
	recent: int(),
})
