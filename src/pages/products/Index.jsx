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
    DatePicker,
    AppProvider, IndexFilters, useBreakpoints
} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {baseUrl} from '../../../utils/baseUrl';

import '../../css/modify.css'

export const Index = () => {
    const [products, setProducts] = useState([]);
    const [commission, setCommission] = useState(0);
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('ascending');
    const [staffMember, setStaffMember] = useState('');
    const [date, setDate] = useState('');
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [applyCommissionAll, setApplyCommissionAll] = useState(0);
    const [filterProducts, setFilterProducts] = useState('');


    const fetchProducts = async () => {
        try {
            const response = await fetch(`${baseUrl}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    //filter products by  filterProducts use useMemo


    const filterProductsData = useMemo(() => {
        return products.filter((product) => {
            return filterProducts ? product.name.toLowerCase().includes(filterProducts.toLowerCase()) : true;
        });
    }, [filterProducts, products]);


    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
        useIndexResourceState(products);


    const handleBulkActionCommission = async() => {
        try {
            const selectedProductIds = selectedResources;
            const data = {
                commissionPercentage: commission || applyCommissionAll,
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
                .then(data => {
                    setModal(false);
                    setApplyCommissionAll('');
                    handleSelectionChange([]);
                    fetchProducts();
                })
                .catch(error => {})
        } catch (error) {

        }
    };

    const filterOrderByCommissionHandler = async () => {
        try {
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
                    handleSelectionChange([]);
                    fetchProducts();
                })
                .catch(error => {
                    setLoading(false);
                    setError(error.message);
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
                    setModal(false);
                    setApplyCommissionAll('');
                    handleSelectionChange([]);
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


    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    const rowMarkup = filterProductsData.map((product, index) => {
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
                position={index}
            >
                <IndexTable.Cell>
                    <Text as="span">{name}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{category}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">{price}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                   <div
                         className="flex"
                   >
                       <span className="w-5 mr-10">
                           <TextField
                           className="width-50"
                           placeholder="%"
                           disabled
                       />
                       </span>
                       <span
                            className="w-10"
                       >
                           <TextField
                               type="number"
                               value={commissionPercentage}
                               onChange={(value) => handleCommissionChange(_id, value)}
                               autoComplete="off"
                           />
                       </span>
                   </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });

    const handleSubmit = () => {}

    return (
        <AppProvider i18n={enTranslations}>
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
                        Total commission Base on Orders: {result.totalCommission} - {result.staffMember}
                    </Text> </TextContainer>)
                }
                {
                    result && result.length > 0 && (
                        <Text >
                            Orders for {result.staffMember} From Date range
                            {
                                result.orders.map((order, index) => {
                                    return (
                                        <div key={index}>
                                            {
                                                order.products.map((product, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <TextContainer>
                                                                <Text>
                                                                 Product   {product.name} - Price {product.price} - Commission Percentage {product.commissionPercentage} - Commission {product.commission}
                                                                </Text>
                                                            </TextContainer>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                        }
                        </Text>
                    )
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
                <IndexFilters
                    sortOptions={
                        [
                            {label: 'Commission', value: 'commission'},
                            {label: 'Price', value: 'price'},
                            {label: 'Name', value: 'name'},
                            {label: 'Category', value: 'category'}
                        ]
                    }
                    queryPlaceholder="Searching in all"
                    tabs={
                        [
                            {
                                id: 'all-products',
                                content: 'All',
                                accessibilityLabel: 'All products',
                                filter: {
                                    sortKey: sortBy,
                                    sortDir: sortDirection,
                                },
                            },
                        ]
                    }
                />
                {
                    selectedResources.length > 0 && (
                        <div className="flex-end mt-10 mb-10">
                            <span className="mr-10">
                                <TextField
                                    className="width-50"
                                    placeholder="Filter by name"
                                    value={filterProducts}
                                    onChange={(value) => setFilterProducts(value)}
                                />
                            </span>
                             <span className="w-5 mr-10 ">
                                   <TextField
                                       className="width-50"
                                       placeholder="%"
                                       disabled
                                   />
                               </span>
                            <TextField
                                className="width-50"
                                placeholder="%"
                                value={applyCommissionAll}
                                onChange={(value) => setApplyCommissionAll(value)}
                            />
                        </div>
                    )
                }
                <IndexTable
                    condensed={useBreakpoints().smDown}
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
                        hasNext: true,
                        product: 'products',
                    }}
                    sort={{
                        value: sortBy,
                        reverse: sortDirection === 'descending',
                    }}
                    onSortChange={(selectedColumnId, sortDirection) => {
                        setSortBy(selectedColumnId);
                        setSortDirection(sortDirection);
                    }}
                    sortable={['name', 'category', 'price']}
                    bulkActions={[
                        {
                            content: 'Apply to selected products',
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
        </AppProvider>
    )
}

export default Index;