import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    DatePicker,
    Form,
    FormLayout,
    Icon,
    InlineStack,
    Popover,
    Scrollable,
    Select,
    TextField,
} from '@shopify/polaris';
import { ArrowRightMinor, CalendarMinor } from '@shopify/polaris-icons';

export const Index = ({ startDate, endDate, staffMember, action }) => {
    const [popoverActive, setPopoverActive] = useState(false);
    const [activeDateRange, setActiveDateRange] = useState('today');
    const [sinceDate, setSinceDate] = useState('');
    const [untilDate, setUntilDate] = useState('');

    const datePickerRef = useRef(null);

    useEffect(() => {
        const today = new Date();
        console.log('Today:', today);
        setSinceDate(today);
        setUntilDate(today);
    }, []);


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
        <Form onSubmit={handleSubmit}>
            <FormLayout>
                <TextField
                    value={staffMember}
                    label="Staff Member"
                    autoComplete="staffMember"
                />

                <Popover
                    active={popoverActive}
                    activator={
                        <Button onClick={() => setPopoverActive(!popoverActive)}>
                            {`${activeDateRange.charAt(0).toUpperCase()}${activeDateRange.slice(1)}`}
                        </Button>
                    }
                    onClose={() => setPopoverActive(false)}
                >
                    <Popover.Pane fixed>
                        <Box padding="base">
                            <Select
                                label="Date Range"
                                options={['today', 'yesterday', 'last 7 days']}
                                value={activeDateRange}
                                onChange={(value) => setActiveDateRange(value)}
                            />
                        </Box>
                        <Box padding="base">
                            <InlineStack alignment="center">
                                <DatePicker
                                    selected={sinceDate}
                                    month={new Date(sinceDate).getMonth()}
                                    year={new Date(sinceDate).getFullYear()}
                                    onChange={(newSinceDate) => setSinceDate(newSinceDate)}
                                />
                                <Icon source={ArrowRightMinor} />
                                <DatePicker
                                    selected={untilDate}
                                    month={new Date(untilDate).getMonth()}
                                    year={new Date(untilDate).getFullYear()}
                                    onChange={(newUntilDate) => setUntilDate(newUntilDate)}
                                />
                            </InlineStack>
                        </Box>
                    </Popover.Pane>
                    <Popover.Pane fixed>
                        <Box padding="base">
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button primary onClick={handleApply}>
                                Apply
                            </Button>
                        </Box>
                    </Popover.Pane>
                </Popover>

                <Button onClick={action}>Submit</Button>
            </FormLayout>
        </Form>
    );
};

export default Index;
