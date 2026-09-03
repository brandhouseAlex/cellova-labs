/** Visual style: public ecommerce routing uses one uninterrupted Cellova shell. */
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartPanel } from "./components/storefront/CartPanel";
import { SiteFooter } from "./components/storefront/SiteFooter";
import { SiteHeader } from "./components/storefront/SiteHeader";
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
import NotFound from "./pages/NotFound";
import { CELLLOVA_SITE } from "./lib/cellova";

function StorefrontRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/catalog" component={CatalogPage} />
      <Route path="/catalog/:handle" component={ProductDetailPage} />
      <Route path="/coa-library" component={CoaLibraryPage} />
      <Route path="/research-access" component={ResearchAccessPage} />
      <Route path="/access" component={AccessPortalPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/policies/:policy" component={PolicyPage} />
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
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
