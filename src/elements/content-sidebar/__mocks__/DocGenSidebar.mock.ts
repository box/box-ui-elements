const mockData = [
    {
        tag_content: '{{ isActive }}',
        tag_type: 'text',
        json_paths: ['isActive'],
    },
    {
        tag_content: '{{ about }}',
        tag_type: 'text',
        json_paths: ['about', 'about.name'],
    },
    {
        tag_content: '{{ phone }}',
        tag_type: 'text',
        json_paths: ['phone'],
    },
    {
        tag_content: '{{ company }}',
        tag_type: 'text',
        json_paths: ['company', 'company.name'],
    },
    {
        tag_content: '{{contract.customerName}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerName'],
    },

    {
        tag_content: '{{contract.customerAddress.street}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.street'],
    },

    {
        tag_content: '{{contract.customerAddress.city}}',
        tag_type: 'text',
        json_paths: ['contract', 'contract.customerAddress', 'contract.customerAddress.city'],
    },
    {
        tag_content: '{{if contract.country == “UK”}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country'],
    },
    {
        tag_content: '{{if contract.country == “1111” and contract.city == “London” }}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
    },
    {
        tag_content: '{{elseif contract.country == “JAPAN” and contract.city == “Tokyo“}}',
        tag_type: 'conditional',
        json_paths: ['contract', 'contract.country', 'contract.city'],
    },
    {
        tag_content: '{{invoice.image}}',
        tag_type: 'image',
        json_paths: ['invoice', 'invoice.image'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products'],
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{$sum(products.amount)}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.amount'],
    },
    {
        tag_content: '{{invoice.id}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.id'],
    },
    {
        tag_content: '{{invoice.date}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.date'],
    },
    {
        tag_content: '{{invoice.billingAddress.street::uppercase}}',
        tag_type: 'text',
        json_paths: ['invoice', 'invoice.billingAddress', 'invoice.billingAddress.street'],
    },
    {
        tag_content: '{{tablerow item in products }}',
        tag_type: 'table-loop',
        json_paths: ['products', 'products.name', 'products.description', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.name}}',
        tag_type: 'text',
        json_paths: ['products', 'products.name', 'products.quantity', 'products.price'],
    },
    {
        tag_content: '{{item.quantity * item.price}}',
        tag_type: 'arithmetic',
        json_paths: ['products', 'products.quantity', 'products.price'],
    },
];

export default mockData;
