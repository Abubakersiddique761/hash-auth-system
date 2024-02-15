import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export function Dashboard(params: any) {

  return (
    <div className="grid overflow-hidden w-full">
      <main className="flex flex-1 flex-col w-full">
        <div className="border shadow-sm rounded-lg w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="md:min-w-[100px]">User</TableHead>
                <TableHead className="md:min-w-[100px]">Hash</TableHead>
                <TableHead className="min-w-[100px]">Session</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                params.users.map((user: any, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="break-all">{user.passwordHash}</TableCell>
                      <TableCell className="break-all">
                        {
                          user.username == params.authenticatedUser.user.username ?
                            <div className="text-green-500 font-bold">
                              Connected
                            </div>
                            :
                            <div className="text-gray-500">
                              Disconnected
                            </div>
                        }
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}