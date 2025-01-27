import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export interface user {
	name: string
	recent: number
}

export const user = sqliteTable("user", {
	name: text(),
	recent: int(),
})
