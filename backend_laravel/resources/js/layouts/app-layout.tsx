import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import MessageReturned from '@/components/personalized/message-returned';


export default function AppLayout({

    
    breadcrumbs =[],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
   
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <MessageReturned />
            {children}
        </AppLayoutTemplate>
    );
}
