import { getDashboardData } from "@/lib/data"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/data-table/columns"

export default async function DashboardPage() {
  try {
    const data = await getDashboardData()

    return (
      <main className="min-h-screen bg-[#f8f9fb] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    )
  } catch (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#f8f9fb]">
        <h2 className="text-xl font-semibold text-destructive">Error loading dashboard</h2>
        <p className="text-muted-foreground">Please check your database connection.</p>
      </div>
    )
  }
}
