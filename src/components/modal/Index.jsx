import {Button, Frame, Modal, TextContainer, TextField} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export const  Index = ({active,setActive, staffMember, setStaffMember, staffOrderHandler }) => {



    return (
        <div>
            <Modal
                open={active}
                onClose={setActive}
                title="staff Member"
                primaryAction={{
                    content: 'Save Order',
                    onAction: staffOrderHandler,
                }}
            >
                <Modal.Section>
                    <TextField
                        label="Stff name"
                               value={staffMember}
                                 onChange={(value) => setStaffMember(value)}
                     autoComplete="off"
                    />
                </Modal.Section>
            </Modal>
        </div>
    );
}

export default Index;