import {Button, Frame, Modal, TextContainer, TextField} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export const  Index = ({active,setActive, actionHandler, children, title, content }) => {

   const closedModal = useCallback(() => setActive(false), [setActive]);

    return (
        <div>
            <Modal
                open={active}
                onClose={closedModal}
                title={title}
                primaryAction={{
                    content: content,
                    onAction: actionHandler,
                }}
            >
                <Modal.Section>
                    {children}
                </Modal.Section>
            </Modal>
        </div>
    );
}

export default Index;