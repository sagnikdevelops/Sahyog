-- Sahyog Seed Data for Supabase PostgreSQL
-- 1. Insert Federation
INSERT INTO federations (id, name, registration_no, state, contact_email, phone)
VALUES ('fed_delhi_ncr', 'National Capital Region Labour Cooperative Federation', 'FED/NCR/2015/0014', 'Delhi & NCR', 'contact@ncrfederation.org', '+91 11 2649 8871')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Cooperatives
INSERT INTO cooperatives (id, federation_id, name, registration_no, district, address, contact_person, phone, email, is_active)
VALUES 
('coop_noida_1', 'fed_delhi_ncr', 'Noida Shramik Utthan Labour Cooperative Society Ltd.', 'UP/COOP/2018/8892', 'Gautam Buddha Nagar', 'Plot 18, Block C, Sector 62, Noida, UP 201301', 'Sunita Deshmukh', '+91 98222 33445', 'admin.noida@sahyogcoop.in', true),
('coop_ghaziabad_1', 'fed_delhi_ncr', 'Ghaziabad Kaushal Vikas Labour Cooperative Society Ltd.', 'UP/COOP/2020/4119', 'Ghaziabad', 'B-2, Industrial Area, Raj Nagar, Ghaziabad, UP 201002', 'Mahesh Chandra', '+91 98444 55667', 'admin.gzb@sahyogcoop.in', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Service Categories
INSERT INTO service_categories (id, name, name_hi, slug, description, description_hi, icon_name, is_active)
VALUES
('cat_electrical', 'Electrical Services', 'विद्युत सेवाएं', 'electrical', 'Wiring, switchboard repairs, appliance installation and power backup setup.', 'वायरिंग, स्विचबोर्ड मरम्मत, उपकरण स्थापना और विद्युत सुरक्षा कार्य।', 'Zap', true),
('cat_plumbing', 'Plumbing Services', 'प्लंबिंग सेवाएं', 'plumbing', 'Pipe leak fixes, tap & shower fitting, water tank cleaning and drainage unclogging.', 'पाइप लीकेज, नल व शॉवर फिटिंग, पानी की टंकी की सफाई और मोटर मरम्मत।', 'Wrench', true),
('cat_carpentry', 'Carpentry & Furniture', 'बढ़ईगीरी व फर्नीचर', 'carpentry', 'Furniture assembly, door lock fixing, cabinet repairs and woodwork.', 'फर्नीचर निर्माण, दरवाजे के ताले, अलमारी मरम्मत और लकड़ी का कार्य।', 'Hammer', true),
('cat_painting', 'Painting & Whitewash', 'पेंटिंग व पुताई', 'painting', 'Interior/exterior wall painting, waterproofing and damp proofing.', 'आंतरिक एवं बाहरी दीवार पेंटिंग, वॉटरप्रूफिंग और सफेदी कार्य।', 'Paintbrush', true),
('cat_cleaning', 'Deep Cleaning & Sanitation', 'सफाई एवं स्वच्छता', 'cleaning', 'Home deep cleaning, kitchen degreasing, bathroom disinfection.', 'घर की डीप क्लीनिंग, रसोई व बाथरूम की स्वच्छता और सोफा सफाई।', 'Sparkles', true),
('cat_domestic', 'Domestic & Household Help', 'घरेलू सहायता', 'domestic-help', 'Verified cooperative domestic helpers and housekeeping support.', 'सत्यापित सहकारी घरेलू सहायक और गृह व्यवस्था।', 'Home', true),
('cat_caregiving', 'Elderly & Patient Care', 'बुजुर्ग व मरीज देखभाल', 'caregiving', 'Trained and cooperative-verified caregivers and assistance.', 'प्रशिक्षित और सहकारी-सत्यापित देखभालकर्ता।', 'HeartHandshake', true),
('cat_gardening', 'Gardening & Landscaping', 'बागवानी व पौध संरक्षण', 'gardening', 'Lawn mowing, plant pruning and terrace garden setup.', 'लॉन कटाई, पौधों की छंटाई और बागवानी सेटअप।', 'Flower2', true),
('cat_driving', 'Driver on Demand', 'ड्राइवर सेवा', 'driving', 'Verified cooperative commercial and personal drivers.', 'सत्यापित सहकारी व्यक्तिगत एवं व्यावसायिक ड्राइवर सेवा।', 'Car', true),
('cat_technical', 'Technical & Appliance Repair', 'तकनीकी उपकरण मरम्मत', 'technical', 'AC servicing, washing machine and refrigerator repairs.', 'एसी सर्विसिंग, वाशिंग मशीन और फ्रिज मरम्मत सेवा।', 'Cpu', true)
ON CONFLICT (id) DO NOTHING;