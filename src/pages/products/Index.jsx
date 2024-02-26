"use client";

import {
    IndexTable,
    Card as LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
    TextField,
    LegacyStack,
    Collapsible,
    Button,
    TextContainer,
    Form,
    FormLayout,
    DatePicker, Icon
} from '@shopify/polaris';
import React, {useCallback, useEffect, useState} from 'react';
import Filter from '../../components/filter/Index';
import {baseUrl} from '../../../utils/baseUrl';
import {ArrowRightMinor} from "@shopify/polaris-icons";

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
};
export const Index = () => {
    const [products, setProducts] = useState([]);
    const [commission, setCommission] = useState(0);
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('ascending');
    const [staffMember, setStaffMember] = useState('');
    const [date, setDate] = useState('');
    const [open, setOpen] = useState(true);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${baseUrl}/products`);
                const data = await response.json();
                console.log('data', data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };
        fetchProducts();

    }, []);


    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(products,{
            resourceName,
            idForItem: (product) => product._id,
            idAttribute: '_id',

    });

    const handleBulkActionCommission = async() => {
        try {
            const selectedProductIds = selectedResources;
            const data = {
                commissionPercentage: commission,
                productIds: selectedProductIds
            };

            fetch(`${baseUrl}/commissions/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                , body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {})
                .catch(error => {})
        } catch (error) {

        }
    };

    const filterOrderByCommissionHandler = async () => {
        try {
            console.log('sortBy', sortBy);
            setLoading(true);
            if (date === '') {
                setLoading(false);
                alert('Please select a date');
            }
            const data = {
                staffMember: staffMember,
                startDate: new Date(date.start).toISOString(),
                endDate: new Date(date.end).toISOString()
            }
            fetch(`${baseUrl}/commissions/calculate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    setResult(data);
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                })
        } catch (error) {
            setLoading(false);
        }
    }

    const staffOrderHandler =  async() => {
        try {
            const selectedProductIds = selectedResources;
            const data = {
                staffMember: staffMember,
                products: selectedProductIds
            };

            fetch(`${baseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
                , body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                })
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const handleCommissionChange = (productId, value) => {
        // Update the state with the new commission value for the specific product

        console.log('productId', productId);
        console.log('value', value);
        setProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product._id === productId) {
                    setCommission(value);
                    return { ...product, commissionPercentage: value };
                }
                return product;
            });
        });
    };

    const rowMarkup = products.map((product) => {
        const {
            _id,
            name,
            category,
            price,
            commissionPercentage
        } = product;

        return (
            <IndexTable.Row
                id={_id}
                key={_id}
                selected={selectedResources.includes(_id)}
                position={_id}
            >
                <IndexTable.Cell>
                    <Text>{name}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text>{category}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text>{price}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <TextField
                        type="number"
                        value={commissionPercentage}
                        onChange={(value) => handleCommissionChange(_id, value)}
                        autoComplete="off"
                    />
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });


    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    const handleApply = () => {
        // Implement logic for applying date range
        setPopoverActive(false);
    };

    const handleCancel = () => {
        // Implement logic for canceling date range selection
        setPopoverActive(false);
    };

    const handleSubmit = () => {}

    return (
        <>
            <LegacyStack vertical>
                <Button
                    onClick={handleToggle}
                    ariaExpanded={open}
                    ariaControls="basic-collapsible"
                >
                    Filter by date and staff member
                </Button>
                {
                    result && ( <TextContainer> <Text >
                        Total commission: {result.totalCommission} - {staffMember}
                    </Text> </TextContainer>)
                }
                <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                    expandOnPrint
                >
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                value={staffMember}
                                onChange={(value) => setStaffMember(value)}
                                label="Staff Member"
                                autoComplete="staffMember"
                            />
                            <DatePicker
                                month={new Date().getMonth()}
                                year={new Date().getFullYear()}
                                onChange={(value) => setDate(value)}
                                selected={date}
                                onMonthChange={(month, year) => console.log(month, year)}
                            />
                            <Button onClick={filterOrderByCommissionHandler}>
                                {
                                    loading ? 'Loading...' : 'Apply filter'
                                }
                            </Button>
                        </FormLayout>
                    </Form>
                </Collapsible>
            </LegacyStack>
            <LegacyCard>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={products.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        {title: 'Name'},
                        {title: 'Category'},
                        {title: 'Price'},
                        {title: ''},
                    ]}
                    pagination={{
                        hasPrevious: false,
                        hasNext: true,
                        onNext: () => {
                            console.log('Next');
                        },
                    }}
                    sort={{
                        value: sortBy,
                        reverse: sortDirection === 'descending',
                    }}
                    onSortChange={(selectedColumnId, sortDirection) => {
                        setSortBy(selectedColumnId);
                        setSortDirection(sortDirection);
                    }}
                    bulkActions={[
                        {
                            content: 'Add commission',
                            onAction: () => handleBulkActionCommission(),
                        },
                        {
                            content: 'Remove commission',
                            onAction: () => console.log('Remove commission'),
                        },
                        {
                            content: 'Add staff order',
                            onAction: () => staffOrderHandler(),
                        }
                    ]}

                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>
        </>
    )
}

export default Index;