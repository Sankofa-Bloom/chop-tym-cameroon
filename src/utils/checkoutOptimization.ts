// Optimization utilities for checkout process

export const optimizeOrderData = (orderData: any) => {
  // Pre-format the order data to reduce processing time
  return {
    ...orderData,
    // Pre-calculate totals to avoid recalculation
    total_formatted: new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(orderData.total),
    
    // Prepare timestamps
    created_timestamp: new Date().toISOString(),
    
    // Normalize phone number once
    normalized_phone: normalizePhoneNumber(orderData.customer_phone),
  };
};

export const normalizePhoneNumber = (phone: string): string => {
  // Remove any existing formatting
  let cleanPhone = phone.replace(/^\+?237\s?/, '');
  
  // Ensure it starts with 237
  if (!cleanPhone.startsWith('237')) {
    cleanPhone = '237' + cleanPhone;
  }
  
  return cleanPhone;
};

export const validateOrderData = (formData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.fullName?.trim()) errors.push("Full name is required");
  if (!formData.phone?.trim()) errors.push("Phone number is required");
  if (!formData.address?.trim()) errors.push("Address is required");
  if (!formData.town?.trim()) errors.push("Town is required");
  if (!formData.street?.trim()) errors.push("Street is required");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};