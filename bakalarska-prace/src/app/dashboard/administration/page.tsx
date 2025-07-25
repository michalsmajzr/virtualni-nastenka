"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import { UserAdministration } from "@/types/user";
import TopBar from "@/components/TopBar";
import Image from "next/image";
import IconButton from "@/components/IconButton";
import Dialog from "@/components/Dialog";
import TextDialog from "@/components/TextDialog";
import { useContext } from "react";
import { SnackbarContext } from "@/components/Snackbar";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdministrationPage() {
  const router = useRouter();

  const { setSnackbar } = useContext(SnackbarContext);
  const [users, setUsers] = useState<UserAdministration[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/administration");

    if (res.ok) {
      const data = await res.json();
      const { users } = data;
      setUsers(users);
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDeleteUser(id: number) {
    const res = await fetch(`/api/administration/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
      setSnackbar("Uživatel byl odstraněn.");
    } else {
      setSnackbar("Chyba serveru! Zkuste to později.");
    }
  }

  return (
    <>
      <TopBar name="Administrace" />
      <DashboardLayout>
        <Dialog
          isOpen={isOpen}
          close={() => {
            setIsOpen(false);
          }}
        >
          <TextDialog
            text="Opravdu chcete smazat uživatele?"
            close={() => setIsOpen(false)}
            submit={() => {
              if (userId) {
                handleDeleteUser(userId);
              }
            }}
          />
        </Dialog>
        <h1 className="hidden text-display-large mb-6 lg:block">
          Administrace
        </h1>
        <div className="p-6 bg-surface-container rounded-3xl">
          <table className="w-full table-auto">
            <thead>
              <tr className="h-14 text-font-medium border-b border-outline">
                <th className="text-left px-4" scope="col">
                  Jméno
                </th>
                <th className="hidden text-left px-4 md:table-cell" scope="col">
                  E-mail
                </th>
                <th className="hidden text-left px-4 lg:table-cell" scope="col">
                  Telefon
                </th>
                <th className="text-left px-4" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user.id}
                  onClick={() =>
                    router.push(`/dashboard/administration/user/${user.id}`)
                  }
                  className="h-14 cursor-pointer hover:bg-surface-container-highest"
                >
                  <td className="px-4">
                    <div className="flex items-center gap-4">
                      {user.url ? (
                        <Image
                          src={user.url}
                          width={36}
                          height={36}
                          alt="Profile picture"
                          style={{
                            objectFit: "cover",
                          }}
                          className="hidden h-9 w-9 rounded-full sm:inline"
                        />
                      ) : (
                        <ReactSVG
                          src="/icons/account-circle-36dp.svg"
                          className="hidden text-on-surface-variant sm:inline"
                        />
                      )}
                      <span>
                        {user.firstname} {user.surname}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 md:table-cell">{user.email}</td>
                  <td className="hidden px-4 lg:table-cell">{user.phone}</td>
                  <td className="text-right px-4">
                    <div className="flex items-center justify-center gap-2">
                      <IconButton
                        src="/icons/edit.svg"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          router.push(
                            `/dashboard/administration/edit-user/${user.id}`
                          );
                        }}
                      />
                      <IconButton
                        src="/icons/delete.svg"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          setUserId(user.id);
                          setIsOpen(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </>
  );
}
