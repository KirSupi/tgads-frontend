import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import axios from "axios";
import {apiErrorHandler} from "../utils/api_errors_handler";
import {Button, Checkbox, Chip, Flex, Group, Input, Modal, Popover, Table} from "@mantine/core";
import {dateSorter, reverseSorter} from "../utils/sorters";
import {useDisclosure} from "@mantine/hooks";
import {Form, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {formatDate} from "date-fns";

export default function Main() {
    const {data: campaigns, refetch} = useQuery(['/campaigns'], () =>
        axios
            .get('/api/campaigns')
            .then(res => res?.data?.data || null)
            .catch(apiErrorHandler)
    );

    const TableRow = ({item}) => <Table.Tr>
        <Table.Td>{item.id}</Table.Td>
        <Table.Td>{item.name}</Table.Td>
        <Table.Td>
            <Popover width={300} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <Button variant='light'>Показать</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <Flex direction='column'
                          gap='md'>
                    <div dangerouslySetInnerHTML={{__html: item.text}}/>
                    <Button variant='light'
                            onClick={()=>window.open(item.link, '_blank')}>
                        {item.button_text}
                    </Button>
                    </Flex>
                </Popover.Dropdown>
            </Popover>
        </Table.Td>
        <Table.Td>{item.link}</Table.Td>
        <Table.Td>
            <Checkbox checked={item.active}
                  label={item.active ? 'Активна' : 'Неактивна'}
                      onChange={() => {
                  }}/>
        </Table.Td>
        <Table.Td>{formatDate(new Date(item.created_at), 'yyyy.MM.dd HH:mm:ss')}</Table.Td>
    </Table.Tr>

    const [openedCreateCampaign, {open: openCreateCampaign, close: closeCreateCampaign}] = useDisclosure(false);
    const CreateCampaignForm = () => {
        const form = useForm({
            mode: 'uncontrolled',
            initialValues: {
                link: '',
                name: '',
            },
        });

        return <Form form={form} onSubmit={values => {
            axios
                .post('/api/campaigns', values, {
                    link: values?.link,
                    name: values?.name,
                })
                .then(res => {
                    notifications.show({
                        title: 'Кампания создана',
                    });
                    refetch().catch(apiErrorHandler);
                })
                .catch(apiErrorHandler);
            closeCreateCampaign();
        }}>
            <Flex gap='sm' direction='column'>
                <Input placeholder='Ссылка на кампанию'
                       required
                       name='link'
                       key={form.key('link')}
                       {...form.getInputProps('link')}/>
                <Input placeholder='Название кампании'
                       name='name'
                       key={form.key('name')}
                       {...form.getInputProps('name')}/>
                <Button type='submit'
                        fullWidth>
                    Создать
                </Button>
            </Flex>
        </Form>
    }

    return <>
        <Group>
            <Button variant='primary'
                    onClick={openCreateCampaign}>
                Создать
            </Button>
            <Modal title='Добавление кампании'
                   opened={openedCreateCampaign}
                   onClose={closeCreateCampaign}>
                <CreateCampaignForm/>
            </Modal>
        </Group>
        <Table stickyHeader
               highlightOnHover
               withRowBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Название</Table.Th>
                    <Table.Th>Объявление</Table.Th>
                    <Table.Th>Ссылка</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Дата создания</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {(campaigns || [])
                    ?.sort(reverseSorter(dateSorter))
                    ?.map((item, i) => <TableRow item={item} key={i}/>)}
            </Table.Tbody>
        </Table>
    </>;
}