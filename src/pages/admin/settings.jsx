import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Settings, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Mail, 
  Lock, 
  Globe, 
  Users,
  Save,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: '',
      storeEmail: '',
      storePhone: '',
      storeAddress: '',
      storeCurrency: 'USD',
      timezone: 'UTC',
      maintenanceMode: false
    },
    payment: {
      stripeEnabled: true,
      stripePublishableKey: '',
      stripeSecretKey: '',
      paypalEnabled: true,
      paypalClientId: '',
      paypalSecret: '',
      cashOnDelivery: true
    },
    shipping: {
      flatRate: 5.99,
      freeShippingThreshold: 50,
      shippingZones: [],
      localPickup: true
    },
    notifications: {
      orderConfirmation: true,
      shippingNotification: true,
      adminNewOrder: true,
      adminCancellation: true,
      lowStockAlert: true,
      emailSender: 'noreply@yourstore.com'
    },
    security: {
      require2FA: false,
      passwordResetExpiry: 24,
      loginAttempts: 5,
      ipRestriction: false,
      allowedIPs: []
    },
    integrations: {
      googleAnalyticsId: '',
      facebookPixelId: '',
      mailchimpApiKey: '',
      recaptchaEnabled: false,
      recaptchaSiteKey: '',
      recaptchaSecretKey: ''
    },
    staff: {
      roles: [],
      permissions: {}
    }
  });

  // Get token and verify auth
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return null;
    }
    return token;
  };

  // // Fetch settings
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     const token = getAuthToken();
  //     if (!token) return;

  //     try {
  //       setLoading(true);
  //       const response = await api.get('/admin/settings', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
        
  //       if (response.data) {
  //         setSettings(response.data);
  //       }
  //     } catch (err) {
  //       console.error('Error fetching settings:', err);
  //       setError(err.response?.data?.message || err.message || 'Failed to fetch settings');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSettings();
  // }, [navigate]);

  // Handle form changes
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  // Save settings
  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setSaving(true);
      setSaveSuccess(false);
      setError(null);

      await api.put('/admin/settings', settings, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Tab navigation items
  const tabs = [
    { id: 'general', icon: <Settings size={18} />, label: 'General' },
    { id: 'payment', icon: <CreditCard size={18} />, label: 'Payment' },
    { id: 'shipping', icon: <Truck size={18} />, label: 'Shipping' },
    { id: 'notifications', icon: <Mail size={18} />, label: 'Notifications' },
    { id: 'security', icon: <Lock size={18} />, label: 'Security' },
    { id: 'integrations', icon: <Globe size={18} />, label: 'Integrations' },
    { id: 'staff', icon: <Users size={18} />, label: 'Staff' }
  ];

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen p-8 ml-[5rem] lg:ml-64 bg-gray-50">
  //       <div className="text-center">
  //         <Settings className="w-8 h-8 text-pink-500 animate-pulse mx-auto" />
  //         <p className="mt-2 text-gray-600">Loading settings...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 ml-[5rem] lg:ml-64 bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading settings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Helmet>
        <title>Settings | Admin | Your Store</title>
      </Helmet>
      <div className="flex-1 p-4 md:p-8 ml-0 lg:ml-64 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Settings</h1>
              <p className="text-gray-600">Configure your store preferences</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors disabled:bg-pink-400"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-200">
              Settings saved successfully!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="flex border-b border-gray-200">
              <nav className="flex-1 flex overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.general.storeName}
                          onChange={(e) => handleChange('general', 'storeName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.general.storeEmail}
                          onChange={(e) => handleChange('general', 'storeEmail', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Phone</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.general.storePhone}
                          onChange={(e) => handleChange('general', 'storePhone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.general.storeCurrency}
                          onChange={(e) => handleChange('general', 'storeCurrency', e.target.value)}
                        >
                          <option value="USD">US Dollar (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="GBP">British Pound (GBP)</option>
                          <option value="JPY">Japanese Yen (JPY)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Store Address</h2>
                    <div className="mt-1">
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        value={settings.general.storeAddress}
                        onChange={(e) => handleChange('general', 'storeAddress', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Other Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.general.timezone}
                          onChange={(e) => handleChange('general', 'timezone', e.target.value)}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                          <option value="GMT">Greenwich Mean Time (GMT)</option>
                        </select>
                      </div>
                      <div className="flex items-center pt-6">
                        <input
                          type="checkbox"
                          id="maintenanceMode"
                          checked={settings.general.maintenanceMode}
                          onChange={() => handleCheckboxChange('general', 'maintenanceMode')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                          Enable Maintenance Mode
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="stripeEnabled"
                              checked={settings.payment.stripeEnabled}
                              onChange={() => handleCheckboxChange('payment', 'stripeEnabled')}
                              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="stripeEnabled" className="ml-2 block text-sm font-medium text-gray-700">
                              Stripe
                            </label>
                          </div>
                          <img src="/stripe-logo.png" alt="Stripe" className="h-6" />
                        </div>
                        {settings.payment.stripeEnabled && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={settings.payment.stripePublishableKey}
                                onChange={(e) => handleChange('payment', 'stripePublishableKey', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={settings.payment.stripeSecretKey}
                                onChange={(e) => handleChange('payment', 'stripeSecretKey', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="paypalEnabled"
                              checked={settings.payment.paypalEnabled}
                              onChange={() => handleCheckboxChange('payment', 'paypalEnabled')}
                              className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="paypalEnabled" className="ml-2 block text-sm font-medium text-gray-700">
                              PayPal
                            </label>
                          </div>
                          <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                        </div>
                        {settings.payment.paypalEnabled && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={settings.payment.paypalClientId}
                                onChange={(e) => handleChange('payment', 'paypalClientId', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                value={settings.payment.paypalSecret}
                                onChange={(e) => handleChange('payment', 'paypalSecret', e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="cashOnDelivery"
                            checked={settings.payment.cashOnDelivery}
                            onChange={() => handleCheckboxChange('payment', 'cashOnDelivery')}
                            className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <label htmlFor="cashOnDelivery" className="ml-2 block text-sm font-medium text-gray-700">
                            Cash on Delivery
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Flat Rate Shipping ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.shipping.flatRate}
                          onChange={(e) => handleChange('shipping', 'flatRate', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.shipping.freeShippingThreshold}
                          onChange={(e) => handleChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="localPickup"
                        checked={settings.shipping.localPickup}
                        onChange={() => handleCheckboxChange('shipping', 'localPickup')}
                        className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label htmlFor="localPickup" className="ml-2 block text-sm font-medium text-gray-700">
                        Enable Local Pickup
                      </label>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Zones</h2>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-500">Configure shipping zones and rates based on location.</p>
                      <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        Add Shipping Zone
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="orderConfirmation"
                          checked={settings.notifications.orderConfirmation}
                          onChange={() => handleCheckboxChange('notifications', 'orderConfirmation')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="orderConfirmation" className="ml-2 block text-sm text-gray-700">
                          Send order confirmation emails to customers
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="shippingNotification"
                          checked={settings.notifications.shippingNotification}
                          onChange={() => handleCheckboxChange('notifications', 'shippingNotification')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="shippingNotification" className="ml-2 block text-sm text-gray-700">
                          Send shipping notifications to customers
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="adminNewOrder"
                          checked={settings.notifications.adminNewOrder}
                          onChange={() => handleCheckboxChange('notifications', 'adminNewOrder')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="adminNewOrder" className="ml-2 block text-sm text-gray-700">
                          Notify admin on new orders
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="adminCancellation"
                          checked={settings.notifications.adminCancellation}
                          onChange={() => handleCheckboxChange('notifications', 'adminCancellation')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="adminCancellation" className="ml-2 block text-sm text-gray-700">
                          Notify admin on order cancellations
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lowStockAlert"
                          checked={settings.notifications.lowStockAlert}
                          onChange={() => handleCheckboxChange('notifications', 'lowStockAlert')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="lowStockAlert" className="ml-2 block text-sm text-gray-700">
                          Send low stock alerts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Sender Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      value={settings.notifications.emailSender}
                      onChange={(e) => handleChange('notifications', 'emailSender', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Authentication</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="require2FA"
                          checked={settings.security.require2FA}
                          onChange={() => handleCheckboxChange('security', 'require2FA')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="require2FA" className="ml-2 block text-sm text-gray-700">
                          Require two-factor authentication for admin access
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password Reset Link Expiry (hours)</label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={settings.security.passwordResetExpiry}
                            onChange={(e) => handleChange('security', 'passwordResetExpiry', parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={settings.security.loginAttempts}
                            onChange={(e) => handleChange('security', 'loginAttempts', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">IP Restrictions</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="ipRestriction"
                          checked={settings.security.ipRestriction}
                          onChange={() => handleCheckboxChange('security', 'ipRestriction')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="ipRestriction" className="ml-2 block text-sm text-gray-700">
                          Restrict admin access to specific IP addresses
                        </label>
                      </div>
                      {settings.security.ipRestriction && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Allowed IP Addresses (one per line)</label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            value={settings.security.allowedIPs.join('\n')}
                            onChange={(e) => handleChange('security', 'allowedIPs', e.target.value.split('\n'))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics Tracking ID</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.integrations.googleAnalyticsId}
                          onChange={(e) => handleChange('integrations', 'googleAnalyticsId', e.target.value)}
                          placeholder="UA-XXXXX-Y"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={settings.integrations.facebookPixelId}
                          onChange={(e) => handleChange('integrations', 'facebookPixelId', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Email Marketing</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mailchimp API Key</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                        value={settings.integrations.mailchimpApiKey}
                        onChange={(e) => handleChange('integrations', 'mailchimpApiKey', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Security</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="recaptchaEnabled"
                          checked={settings.integrations.recaptchaEnabled}
                          onChange={() => handleCheckboxChange('integrations', 'recaptchaEnabled')}
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <label htmlFor="recaptchaEnabled" className="ml-2 block text-sm text-gray-700">
                          Enable reCAPTCHA on forms
                        </label>
                      </div>
                      {settings.integrations.recaptchaEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">reCAPTCHA Site Key</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                              value={settings.integrations.recaptchaSiteKey}
                              onChange={(e) => handleChange('integrations', 'recaptchaSiteKey', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">reCAPTCHA Secret Key</label>
                            <input
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                              value={settings.integrations.recaptchaSecretKey}
                              onChange={(e) => handleChange('integrations', 'recaptchaSecretKey', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Staff Settings */}
              {activeTab === 'staff' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Staff Management</h2>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-500">Manage staff roles and permissions.</p>
                      <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        Add New Role
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Current Roles</h2>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Permissions</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {settings.staff.roles.length > 0 ? (
                            settings.staff.roles.map((role) => (
                              <tr key={role.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{role.name}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {role.permissions.join(', ')}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                  <button className="text-pink-500 hover:text-pink-700 mr-3">
                                    Edit
                                  </button>
                                  <button className="text-red-500 hover:text-red-700">
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                No roles created yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;