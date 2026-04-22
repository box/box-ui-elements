const mockData = [
    {
        tag_content: '{{ isActive }}',
        tag_type: 'text',
        json_paths: ['isActive'],
        required: true,
    },
    {
        tag_content: '{{ about }}',
        tag_type: 'text',
        json_paths: ['about', 'about.name'],
        required: true,
    },
    {
        tag_content: '{{ phone }}',
        tag_type: 'text',
        json_paths: ['phone'],
        required: true,
    },
    {
        tag_content: '{{ company }}',
        tag_type: 'text',
        json_paths: ['company', 'company.name'],
        required: true,
    },
    {
        tag_content: '{{contract.customerName}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerName'],
        required: true,
    },

    {
        tag_content: '{{contract.customerAddress.street}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.street'],
        required: true,
    },

    {
        tag_content: '{{contract.customerAddress.city}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.city'],
        required: true,
    },
    {
        tag_content: '{{if contract.country == “UK”}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country'],
        required: true,
    },
    {
        tag_content: '{{if contract.country == “1111” and contract.city == “London” }}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
        required: true,
    },
    {
        tag_content: '{{elseif contract.country == “JAPAN” and contract.city == “Tokyo“}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
        required: true,
    },
    {
        tag_content: '{{invoice.image}}',
        tag_type: 'image',
        json_paths: ['invoice', 'invoice.image'],
        required: true,
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
        required: true,
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products'],
        required: true,
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
        required: true,
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
        required: true,
    },
    {
        tag_content: '{{$sum(products.amount)}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.amount'],
        required: true,
    },
    {
        tag_content: '{{invoice.id}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.id'],
        required: true,
    },
    {
        tag_content: '{{invoice.date}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.date'],
        required: true,
    },
    {
        tag_content: '{{invoice.billingAddress.street::uppercase}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.billingAddress', 'invoice.billingAddress.street'],
        required: true,
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products', 'products.name', 'products.description', 'products.quantity', 'products.price'],
        required: true,
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
        required: true,
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
        required: true,
    },
];

/** PDF template tags (text, checkbox, radiobutton, dropdown) */
export const mockPdfTemplateData = [
    {
        tag_type: 'text',
        tag_content: '{{NameField::optional}}',
        json_paths: ['NameField'],
        required: false,
    },
    {
        tag_type: 'checkbox',
        tag_content: '{{SubscribeCheckbox}}',
        json_paths: ['SubscribeCheckbox'],
        required: true,
    },
    {
        tag_type: 'radiobutton',
        tag_content: '{{Gender}}',
        json_paths: ['Gender'],
        required: true,
    },
    {
        tag_type: 'dropdown',
        tag_content: '{{CountryDropdown}}',
        json_paths: ['CountryDropdown'],
        required: true,
    },
];

export default mockData;
