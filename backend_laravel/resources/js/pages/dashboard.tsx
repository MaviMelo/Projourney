import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard, register } from '@/routes';
import { route } from 'ziggy-js';
import { List } from "lucide-react";
import { useState, useEffect } from 'react';
import { TableUsers } from '@/pages/user/table-users';
import { TableCourses } from '@/pages/course/table-courses';
import { TableTrails } from '@/pages/trail/table-trails';
import Pinboard from '@/pages/feed/pinboard'

export default function Dashboard({
    users = { data: [], links: [] },
    courses = { data: [], links: [] },
    trails = { data: [], links: [] },
    stats = { total_users: 0, total_collaborators: 0 },
    activeView = 'pinboard'
}) {

    const [view, setView] = useState(activeView);

    useEffect(() => {
        setView(activeView);
    }, [activeView]);

    const userData = users || [];
    const coursesData = courses || [];
    const trailsData = trails || [];

    const dataUsers = () => {
        router.get(route('user.index'));
    };

    const dataCollaborators = () => {
        router.get(route('user.indexCollaborators'))
    };


    function dataCourses() {
        router.get(route('course.index'))
    }
    function dataTrails() {
        router.get(route('trail.index'))
    }

    const createUser = () => {
        router.get(route('user.create'))
    };

    const createCourse = () => {
        router.get(route('course.create'))
    };

    const createTrail = () => {
        router.get(route('trail.create'))
    };


    return (
        <>
            <Head title="Dashboard" />
            <div className="containerDashboard">
                <div className="containerGrid3">
                    <div className="card1">
                        <PlaceholderPattern className="absolute inset-0 size-full  stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className=" textCard3 centralize2">Usuários:</div>
                        <div className="itemsJustify ">Total de clientes:     {stats.total_users}</div>
                        <div className="itemsJustify">Total de colaboradores: {stats.total_collaborators}</div>
                        <div className="itemsJustify hider">
                            <button
                                onClick={createUser}
                                className="buttonPrimary"
                            >
                                Cadastrar novo usuário
                            </button>
                        </div>

                    </div>
                    <div className="card1">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="textCard3 centralize2">Curso:</div>
                        <div className="itemsJustify">Total: {coursesData.data.length}</div>
                        <div className="itemsJustify">Ranking de avaliações:</div>
                        <div className="itemsJustify hider">
                            <button
                                onClick={createCourse}
                                className="buttonPrimary"
                            >
                                Cadastrar novo cruso
                            </button>
                        </div>
                    </div>
                    <div className="card1">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="textCard3 centralize2">Trilhas:</div>
                        <div className="itemsJustify">Total: {trailsData.data.length}</div>
                        <div className="itemsJustify">Ranking de avaliações:</div>
                        <div className="itemsJustify hider">
                            <button
                                onClick={createTrail}
                                className="buttonPrimary"
                            >
                                Criar nova trilha
                            </button>
                        </div>
                    </div>
                </div>
                <div className="containerDashboard">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                    <div className="itemsJustify2 relative z-10 p-4 gap-2 flex">
                        <button
                            className={`button1 ${view === 'users' ? 'button1Selected' : ''}`}
                            onClick={dataUsers}
                        >
                            Listar Usuários <List />
                        </button>

                        <button
                            className={`button1 ${view === 'collaborators' ? 'button1Selected' : ''}`}
                            onClick={dataCollaborators}
                        >
                            Listar Colaboradores <List />
                        </button>

                        <button
                            className={`button1 ${view === 'courses' ? 'button1Selected' : ''}`}
                            onClick={dataCourses}
                        >
                            Listar Cursos <List />
                        </button>

                        <button
                            className={`button1 ${view === 'trails' ? 'button1Selected' : ''}`}
                            onClick={dataTrails}
                        >
                            Listar Trilhas <List />
                        </button>
                    </div>
                    <div className="relative z-10">

                        {/* RENDERIZAÇÃO CONDICIONAL */}

                        {view === 'pinboard' && (
                            <Pinboard />
                        )}


                        {view === 'users' && (
                            <TableUsers title="Usuários" collection={userData} />
                        )}

                        {view === 'collaborators' && (
                            <TableUsers title="Colaboradores" collection={userData} />
                        )}

                        {view === 'courses' && (
                            <TableCourses title="Cursos" collection={coursesData} />
                        )}

                        {view === 'trails' && (
                            <TableTrails title="Trilhas" collection={trails} />
                        )}

                    </div>

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

