import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard, register } from '@/routes';
import { route } from 'ziggy-js';
import { List } from "lucide-react";
import { useState, useEffect } from 'react';
import { TableUsers } from '@/pages/users/table-users';

export default function Dashboard({
    users = { data: [], links: [] },
    courses = [],
    trails = [],
    stats = { total_users: 0, total_collaborators: 0 },
    activeView = 'users'
}) {

    const [view, setView] = useState(activeView);

    useEffect(() => {
        setView(activeView);
    }, [activeView]);

    const userData = users.data || [];

    const dataUsers = () => {
        router.get(route('dashboard'));
    };

    const dataCollaborators = () => {
        router.get(route('user.indexCollaborators'))
    };

    const createUser = () => {
        router.get(route('user.create'))
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            router.delete(route('user.destroy', id), {
                onSuccess: () => {
                    // Opcional: Alguma lógica após sucesso
                },
            });
        };
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="textCard3 centralize2">Usuários</div>
                        <div className="itemsJustify ">Total de clientes:     {stats.total_users}</div>
                        <div className="itemsJustify">Total de colaboradores: {stats.total_collaborators}</div>
                        <div className="itemsJustify hider">
                            <button
                                onClick={createUser}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] "
                            >
                                Cadastrar novo usuário
                            </button>
                        </div>

                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="textCard3 centralize2">Curso:</div>
                        <div className="itemsJustify">Total: {courses.length}</div>
                        <div className="itemsJustify">Ranking de avaliações:</div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="textCard3 centralize2">Trilhas:</div>
                        <div className="itemsJustify">Total: {trails.length}</div>
                        <div className="itemsJustify">Ranking de avaliações:</div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                    <div className="itemsJustify2 relative z-10 p-4 gap-2 flex">
                        <button
                            className={`linkGreen ${view === 'users' ? 'bg-green-600 text-white' : ''}`}
                            onClick={dataUsers}
                        >
                            Listar Usuários <List />
                        </button>

                        <button
                            className={`linkGreen ${view === 'collaborators' ? 'bg-green-600 text-white' : ''}`}
                            onClick={dataCollaborators}
                        >
                            Listar Colaboradores <List />
                        </button>

                        <button
                            className={`linkGreen ${view === 'courses' ? 'bg-green-600 text-white' : ''}`}
                            onClick={() => setView('courses')}
                        >
                            Listar Cursos <List />
                        </button>

                        <button
                            className={`linkGreen ${view === 'trails' ? 'bg-green-600 text-white' : ''}`}
                            onClick={() => setView('trails')}
                        >
                            Listar Trilhas <List />
                        </button>
                    </div>
                    <div className="relative z-10">

                        {/* RENDERIZAÇÃO CONDICIONAL */}

                        {view === 'collaborators' && (
                            <TableUsers title="Colaboradores" data={userData} handleDelete={handleDelete} />
                        )}

                        {view === 'users' && (
                            <TableUsers title="Usuários" data={userData} handleDelete={handleDelete} />
                        )}

                        
                        {/*
                        {view === 'courses' && (
                            <TableGeneric title="Cursos" data={courses} />
                        )}

                        {view === 'trails' && (
                            <TableGeneric title="Trilhas" data={trails} />
                        )}
 */}
                    </div>


                    {/* PAGINAÇÃO */}
                    {(view === 'users' || view === 'collaborators') && (
                        <div className="itemsJustify">
                            <div>
                                {users.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : ' hover:bg-gray-500'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-1 border rounded text-gray-400 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

