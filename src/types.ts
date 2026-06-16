export interface Prospect {
  id?: string;
  company_name: string;
  contact_name: string;
  website_url: string;
  logo_data_url: string;
  primary_color: string;
  secondary_color: string;
  industry: string;
  notes: string;
  created_at?: string;
}

export type ProductCategory =
  | 'direct-mail'
  | 'packaging-labels'
  | 'signage'
  | 'commercial-print'
  | 'fulfillment-kits'
  | 'customer-comms';

export interface ProductCategoryDef {
  id: ProductCategory;
  label: string;
  description: string;
  icon: string;
  templates: MockupTemplate[];
}

export interface MockupTemplate {
  id: string;
  name: string;
  type: 'static' | 'animated';
  description: string;
}

export type AppStep = 'setup' | 'select' | 'mockups' | 'history';
