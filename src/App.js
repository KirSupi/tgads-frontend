import React, {useEffect, useState} from 'react';
import {Navigate, Outlet, Route, Routes, useNavigate} from "react-router-dom";
import axios from "axios";
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import {
    AppShell,
    Burger,
    Button,
    Flex,
    Group,
    Loader,
    NavLink,
    ScrollArea,
} from "@mantine/core";
import {
    IconHome,
} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import Main from "pages/Main";

axios.defaults.withCredentials = true;

function App() {
    const [opened, {toggle}] = useDisclosure();

    const routes = {
        main: '/',
    }

    const NavItem = ({route, label, Icon}) => {
        const navigate = useNavigate();

        return <NavLink href={route}
                        label={label}
                        leftSection={!!Icon ? <Icon height='1rem'/> : null}
                        active={window.location.pathname === route}
                        onClick={e => {
                            e.preventDefault();
                            navigate(route);
                            toggle();
                        }}/>
    }

    return <>
            <AppShell header={{height: '3rem'}}
                      navbar={{
                          width: '14rem',
                          breakpoint: 'md',
                          collapsed: {mobile: !opened},
                      }}
                      padding='md'>
                <AppShell.Header>
                    <Group h='100%' px='md' justify='space-between'>
                        <Burger opened={opened}
                                onClick={toggle}
                                hiddenFrom='sm'
                                size='sm'/>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar p='md'>
                    <AppShell.Section grow component={ScrollArea}>
                        <NavItem route={routes.main}
                                 Icon={IconHome}
                                 label='Главная'/>
                    </AppShell.Section>
                </AppShell.Navbar>

                <AppShell.Main>
                    <Routes>
                        <Route path={routes.main}
                               element={<Main/>}/>
                        <Route path='*' element={<Navigate to={routes.main}/>}/>
                    </Routes>
                    <Outlet/>
                </AppShell.Main>
            </AppShell>
    </>
}

export default App;
