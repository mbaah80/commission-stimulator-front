'use client';
import { Page, AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import Product from '../pages/products/Index';

export default function Home() {

    return (
        <AppProvider i18n={enTranslations}>
            <Page>
                <Product />
            </Page>
        </AppProvider>
    );
}
