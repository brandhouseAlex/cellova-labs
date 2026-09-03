/** Visual style: public ecommerce routing uses one uninterrupted Cellova shell. */
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartPanel } from "./components/storefront/CartPanel";
import { SiteFooter } from "./components/storefront/SiteFooter";
import { SiteHeader } from "./components/storefront/SiteHeader";
import { ResearchGate } from "./components/storefront/ResearchGate";
import {
  AccountPage,
  AccessPortalPage,
  CatalogPage,
  CoaLibraryPage,
  HomePage,
  PolicyPage,
  ProductDetailPage,
  ResearchAccessPage,
} from "./pages/StorefrontPages";
import {
  AboutPage,
  AccountDashboardPage,
  CartPage,
  CheckoutPage,
  CollectionDetailPage,
  CollectionsPage,
  ContactPage,
  ExtendedPolicyPage,
  OrderDetailPage,
  OrdersPage,
  ProductsPage,
} from "./pages/StorefrontParityPages";
import { FunctionalCheckoutPage, FunctionalContactPage, FunctionalOrderDetailPage, FunctionalOrdersPage } from "./pages/FunctionalFlowPages";
import { FunctionalCollectionDetailPage } from "./pages/FunctionalCollectionPage";
import NotFound from "./pages/NotFound";
import { CELLLOVA_SITE } from "./lib/cellova";

function StorefrontRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/catalog" component={CatalogPage} />
      <Route path="/catalog/:handle" component={ProductDetailPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:handle" component={ProductDetailPage} />
      <Route path="/collections" component={CollectionsPage} />
      <Route path="/collections/:handle" component={FunctionalCollectionDetailPage} />
      <Route path="/coa-library" component={CoaLibraryPage} />
      <Route path="/research-access" component={ResearchAccessPage} />
      <Route path="/access" component={AccessPortalPage} />
      <Route path="/account/orders/:id" component={FunctionalOrderDetailPage} />
      <Route path="/account/orders" component={FunctionalOrdersPage} />
      <Route path="/account" component={AccountDashboardPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={FunctionalCheckoutPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={FunctionalContactPage} />
      <Route path="/policies/:policy" component={ExtendedPolicyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: CELLLOVA_SITE.name,
    url: CELLLOVA_SITE.url,
    description: CELLLOVA_SITE.description,
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
          <SiteHeader />
          <StorefrontRoutes />
          <SiteFooter />
          <CartPanel />
          <ResearchGate />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
