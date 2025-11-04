import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

function getRelativeDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const OWNERS = [
  "Rishab Nagwani",
  "Anya Sharma",
  "David Chen",
  "Emily Rodriguez",
  "Ananth Kumar",
  "Sophia Lee",
];
const getRandomOwner = (): string =>
  OWNERS[Math.floor(Math.random() * OWNERS.length)];

export async function seedDatabase(prisma: PrismaClient) {
  console.log("Start seeding with high-fidelity, large-scale data...");

  console.log("Clearing old data...");
  await prisma.opportunities.deleteMany({});
  await prisma.contacts.deleteMany({});
  await prisma.accounts.deleteMany({});
  await prisma.leads.deleteMany({});
  console.log("Old data cleared.");

  const acc_apex = await prisma.accounts.create({
    data: {
      name: "Apex Solutions",
      website: "https://apex-solutions.com",
      type: "Customer",
      description:
        "Global leader in CRM and cloud computing solutions. Key strategic account.",
      account_owner: getRandomOwner(),
      phone: "+1-415-555-0100",
      billing_street: "415 Mission St",
      billing_city: "San Francisco",
      billing_state_province: "CA",
      billing_zip_postal_code: "94105",
      billing_country: "United States",
      shipping_street: "415 Mission St",
      shipping_city: "San Francisco",
      shipping_state_province: "CA",
      shipping_zip_postal_code: "94105",
      shipping_country: "United States",
    },
  });

  const acc_apex_uk = await prisma.accounts.create({
    data: {
      name: "Apex Solutions UK",
      parent_account_id: acc_apex.id,
      website: "https://apex-solutions.co.uk",
      type: "Customer",
      description:
        "EMEA headquarters, located in London. Reports to Apex Global.",
      account_owner: getRandomOwner(),
      phone: "+44-20-7555-0101",
      billing_street: "110 Bishopsgate",
      billing_city: "London",
      billing_zip_postal_code: "EC2N 4AY",
      billing_country: "United Kingdom",
      shipping_street: "110 Bishopsgate",
      shipping_city: "London",
      shipping_zip_postal_code: "EC2N 4AY",
      shipping_country: "United Kingdom",
    },
  });

  const acc_quantum = await prisma.accounts.create({
    data: {
      name: "QuantumCore Tech",
      website: "https://quantumcore.com",
      type: "Partner",
      description: "Major technology partner for cloud infrastructure and OS.",
      account_owner: getRandomOwner(),
      phone: "+1-425-555-0102",
      billing_street: "One Microsoft Way",
      billing_city: "Redmond",
      billing_state_province: "WA",
      billing_zip_postal_code: "98052",
      billing_country: "United States",
      shipping_street: "One Microsoft Way",
      shipping_city: "Redmond",
      shipping_state_province: "WA",
      shipping_zip_postal_code: "98052",
      shipping_country: "United States",
    },
  });

  const acc_helios = await prisma.accounts.create({
    data: {
      name: "Helios Database Inc.",
      website: "https://helios-db.com",
      type: "Competitor",
      description: "Legacy database and enterprise software provider.",
      account_owner: getRandomOwner(),
      phone: "+1-512-555-0103",
      billing_street: "2300 Oracle Way",
      billing_city: "Austin",
      billing_state_province: "TX",
      billing_zip_postal_code: "78741",
      billing_country: "United States",
      shipping_street: "2300 Oracle Way",
      shipping_city: "Austin",
      shipping_state_province: "TX",
      shipping_zip_postal_code: "78741",
      shipping_country: "United States",
    },
  });

  const acc_ecommerce = await prisma.accounts.create({
    data: {
      name: "E-Commerce Pioneers",
      website: "https://ecomm-pioneers.ca",
      type: "Customer",
      description: "Leading e-commerce platform for SMBs and enterprise.",
      account_owner: getRandomOwner(),
      phone: "+1-613-555-0104",
      billing_street: "151 O'Connor St",
      billing_city: "Ottawa",
      billing_state_province: "ON",
      billing_zip_postal_code: "K2P 2L8",
      billing_country: "Canada",
      shipping_street: "151 O'Connor St",
      shipping_city: "Ottawa",
      shipping_state_province: "ON",
      shipping_zip_postal_code: "K2P 2L8",
      shipping_country: "Canada",
    },
  });

  const acc_momentum = await prisma.accounts.create({
    data: {
      name: "Momentum AI",
      website: "https://momentum-ai.com",
      type: "Prospect",
      description:
        "High-performance GPU and AI computing. Strong prospect for cloud services.",
      account_owner: getRandomOwner(),
      phone: "+1-408-555-0105",
      billing_street: "2788 San Tomas Expy",
      billing_city: "Santa Clara",
      billing_state_province: "CA",
      billing_zip_postal_code: "95051",
      billing_country: "United States",
      shipping_street: "2788 San Tomas Expy",
      shipping_city: "Santa Clara",
      shipping_state_province: "CA",
      shipping_zip_postal_code: "95051",
      shipping_country: "United States",
    },
  });

  const acc_alpha = await prisma.accounts.create({
    data: {
      name: "Alpha Education",
      website: "https://alphaedu.in",
      type: "Prospect",
      description:
        "Provider of online learning platforms in India. Evaluating CRM for admissions.",
      account_owner: getRandomOwner(),
      phone: "+91-22-5555-0109",
      billing_street: "Plot No. C-70, G Block",
      billing_city: "Mumbai",
      billing_state_province: "MH",
      billing_zip_postal_code: "400051",
      billing_country: "India",
      shipping_street: "Plot No. C-70, G Block",
      shipping_city: "Mumbai",
      shipping_state_province: "MH",
      shipping_zip_postal_code: "400051",
      shipping_country: "India",
    },
  });

  const acc_starlight = await prisma.accounts.create({
    data: {
      name: "Starlight Studios",
      website: "https://starlight.film",
      type: "Prospect",
      description:
        "Independent film and animation studio. High-growth potential.",
      account_owner: getRandomOwner(),
      phone: "+1-213-555-0105",
      billing_street: "5555 Melrose Ave",
      billing_city: "Los Angeles",
      billing_state_province: "CA",
      billing_zip_postal_code: "90038",
      billing_country: "United States",
      shipping_street: "5555 Melrose Ave",
      shipping_city: "Los Angeles",
      shipping_state_province: "CA",
      shipping_zip_postal_code: "90038",
      shipping_country: "United States",
    },
  });

  const acc_vertex = await prisma.accounts.create({
    data: {
      name: "Vertex Logistics",
      website: "https://vertexlog.com",
      type: "Prospect",
      description:
        "Global logistics and supply chain powerhouse. Evaluating SCM partners.",
      account_owner: getRandomOwner(),
      phone: "+45-33-555-0106",
      billing_street: "Esplanaden 50",
      billing_city: "Copenhagen",
      billing_zip_postal_code: "1263",
      billing_country: "Denmark",
      shipping_street: "Esplanaden 50",
      shipping_city: "Copenhagen",
      shipping_zip_postal_code: "1263",
      shipping_country: "Denmark",
    },
  });

  const acc_finsecure = await prisma.accounts.create({
    data: {
      name: "FinSecure Bank",
      website: "https://finsecure.com",
      type: "Customer",
      description: "Major investment bank and financial services company.",
      account_owner: getRandomOwner(),
      phone: "+1-212-555-0107",
      billing_street: "270 Park Ave",
      billing_city: "New York",
      billing_state_province: "NY",
      billing_zip_postal_code: "10017",
      billing_country: "United States",
      shipping_street: "270 Park Ave",
      shipping_city: "New York",
      shipping_state_province: "NY",
      shipping_zip_postal_code: "10017",
      shipping_country: "United States",
    },
  });

  const acc_summit = await prisma.accounts.create({
    data: {
      name: "Summit Retail",
      website: "https://summit-retail.com",
      type: "Customer",
      description: "Global retail corporation with hypermarket chains.",
      account_owner: getRandomOwner(),
      phone: "+1-479-555-0108",
      billing_street: "702 SW 8th St",
      billing_city: "Bentonville",
      billing_state_province: "AR",
      billing_zip_postal_code: "72716",
      billing_country: "United States",
      shipping_street: "702 SW 8th St",
      shipping_city: "Bentonville",
      shipping_state_province: "AR",
      shipping_zip_postal_code: "72716",
      shipping_country: "United States",
    },
  });

  const acc_summit_west = await prisma.accounts.create({
    data: {
      name: "Summit Retail - West",
      parent_account_id: acc_summit.id,
      website: "https://summit-retail.com/west",
      type: "Customer",
      description: "West Coast distribution and logistics hub.",
      account_owner: getRandomOwner(),
      phone: "+1-213-555-0109",
      billing_street: "800 N Alameda St",
      billing_city: "Los Angeles",
      billing_state_province: "CA",
      billing_zip_postal_code: "90012",
      billing_country: "United States",
      shipping_street: "800 N Alameda St",
      shipping_city: "Los Angeles",
      shipping_state_province: "CA",
      shipping_zip_postal_code: "90012",
      shipping_country: "United States",
    },
  });

  const acc_horizon = await prisma.accounts.create({
    data: {
      name: "Horizon Health",
      website: "https://horizonhealth.com",
      type: "Prospect",
      description: "Major health insurance and services provider.",
      account_owner: getRandomOwner(),
      phone: "+1-860-555-0110",
      billing_street: "900 Cottage Grove Rd",
      billing_city: "Bloomfield",
      billing_state_province: "CT",
      billing_zip_postal_code: "06002",
      billing_country: "United States",
      shipping_street: "900 Cottage Grove Rd",
      shipping_city: "Bloomfield",
      shipping_state_province: "CT",
      shipping_zip_postal_code: "06002",
      shipping_country: "United States",
    },
  });

  const acc_nexus = await prisma.accounts.create({
    data: {
      name: "Nexus Consulting",
      website: "https://nexus.consulting",
      type: "Partner",
      description: "Global consulting firm and integration partner.",
      account_owner: getRandomOwner(),
      phone: "+44-20-7555-0111",
      billing_street: "2 New Street Square",
      billing_city: "London",
      billing_zip_postal_code: "EC4A 3BZ",
      billing_country: "United Kingdom",
      shipping_street: "2 New Street Square",
      shipping_city: "London",
      shipping_zip_postal_code: "EC4A 3BZ",
      shipping_country: "United Kingdom",
    },
  });

  const acc_cybergene = await prisma.accounts.create({
    data: {
      name: "Cybergene Inc.",
      website: "https://cybergene.com",
      type: "Customer",
      description: "Leading biotechnology corporation.",
      account_owner: getRandomOwner(),
      phone: "+1-650-555-0112",
      billing_street: "1 DNA Way",
      billing_city: "South San Francisco",
      billing_state_province: "CA",
      billing_zip_postal_code: "94080",
      billing_country: "United States",
      shipping_street: "1 DNA Way",
      shipping_city: "South San Francisco",
      shipping_state_province: "CA",
      shipping_zip_postal_code: "94080",
      shipping_country: "United States",
    },
  });

  const acc_aether = await prisma.accounts.create({
    data: {
      name: "Aether Aerospace",
      website: "https://aether-aero.com",
      type: "Prospect",
      description: "Aerospace manufacturer and defense contractor.",
      account_owner: getRandomOwner(),
      phone: "+1-703-555-0113",
      billing_street: "929 N Stuart St",
      billing_city: "Arlington",
      billing_state_province: "VA",
      billing_zip_postal_code: "22203",
      billing_country: "United States",
      shipping_street: "929 N Stuart St",
      shipping_city: "Arlington",
      shipping_state_province: "VA",
      shipping_zip_postal_code: "22203",
      shipping_country: "United States",
    },
  });

  const acc_vulcan = await prisma.accounts.create({
    data: {
      name: "Vulcan Manufacturing",
      website: "https://vulcan-mfg.com",
      type: "Customer",
      description: "Manufacturer of heavy construction equipment.",
      account_owner: getRandomOwner(),
      phone: "+1-309-555-0114",
      billing_street: "100 NE Adams St",
      billing_city: "Peoria",
      billing_state_province: "IL",
      billing_zip_postal_code: "61629",
      billing_country: "United States",
      shipping_street: "100 NE Adams St",
      shipping_city: "Peoria",
      shipping_state_province: "IL",
      shipping_zip_postal_code: "61629",
      shipping_country: "United States",
    },
  });

  const acc_terra = await prisma.accounts.create({
    data: {
      name: "TerraEnergy",
      website: "https://terra-energy.com",
      type: "Customer",
      description: "Global group of energy and petrochemical companies.",
      account_owner: getRandomOwner(),
      phone: "+31-70-555-0115",
      billing_street: "Carel van Bylandtlaan 16",
      billing_city: "The Hague",
      billing_zip_postal_code: "2596 HR",
      billing_country: "Netherlands",
      shipping_street: "Carel van Bylandtlaan 16",
      shipping_city: "The Hague",
      shipping_zip_postal_code: "2596 HR",
      shipping_country: "Netherlands",
    },
  });

  const acc_zenith_media = await prisma.accounts.create({
    data: {
      name: "Zenith Media",
      website: "https://zenithmedia.com",
      type: "Prospect",
      description: "Global media and technology company.",
      account_owner: getRandomOwner(),
      phone: "+1-215-555-0116",
      billing_street: "1701 John F Kennedy Blvd",
      billing_city: "Philadelphia",
      billing_state_province: "PA",
      billing_zip_postal_code: "19103",
      billing_country: "United States",
      shipping_street: "1701 John F Kennedy Blvd",
      shipping_city: "Philadelphia",
      shipping_state_province: "PA",
      shipping_zip_postal_code: "19103",
      shipping_country: "United States",
    },
  });

  const acc_everest = await prisma.accounts.create({
    data: {
      name: "Everest Construction",
      website: "https://everest.com",
      type: "Customer",
      description: "Engineering, construction, and project management.",
      account_owner: getRandomOwner(),
      phone: "+1-571-555-0117",
      billing_street: "12011 Sunset Hills Rd",
      billing_city: "Reston",
      billing_state_province: "VA",
      billing_zip_postal_code: "20190",
      billing_country: "United States",
      shipping_street: "12011 Sunset Hills Rd",
      shipping_city: "Reston",
      shipping_state_province: "VA",
      shipping_zip_postal_code: "20190",
      shipping_country: "United States",
    },
  });

  console.log(`Created ${await prisma.accounts.count()} accounts.`);

  const con_marcus = await prisma.contacts.create({
    data: {
      account_id: acc_apex.id,
      salutation: "Mr.",
      first_name: "Marcus",
      last_name: "Vance",
      title: "Chief Executive Officer",
      description:
        "Key decision maker. Visionary. Prefers high-level summaries.",
      contact_owner: getRandomOwner(),
      email: "marcus.vance@apex-solutions.com",
      phone: "+1-415-555-0201",
      mailing_street: "415 Mission St",
      mailing_city: "San Francisco",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "94105",
      mailing_country: "United States",
    },
  });

  const con_brian = await prisma.contacts.create({
    data: {
      account_id: acc_apex.id,
      reports_to_contact_id: con_marcus.id,
      salutation: "Mr.",
      first_name: "Brian",
      last_name: "Shaw",
      title: "Chief Technology Officer",
      description:
        "Technical evaluator. Focused on platform integration and security.",
      contact_owner: getRandomOwner(),
      email: "brian.shaw@apex-solutions.com",
      phone: "+1-415-555-0202",
      mailing_street: "415 Mission St",
      mailing_city: "San Francisco",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "94105",
      mailing_country: "United States",
    },
  });

  const con_carol = await prisma.contacts.create({
    data: {
      account_id: acc_apex.id,
      reports_to_contact_id: con_marcus.id,
      salutation: "Ms.",
      first_name: "Carol",
      last_name: "Mendoza",
      title: "VP of Sales",
      description: "Economic buyer for sales tools.",
      contact_owner: getRandomOwner(),
      email: "carol.mendoza@apex-solutions.com",
      phone: "+1-415-555-0203",
      mailing_street: "415 Mission St",
      mailing_city: "San Francisco",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "94105",
      mailing_country: "United States",
    },
  });

  const con_elena = await prisma.contacts.create({
    data: {
      account_id: acc_apex_uk.id,
      reports_to_contact_id: con_carol.id,
      salutation: "Ms.",
      first_name: "Elena",
      last_name: "Dubois",
      title: "VP, EMEA",
      description:
        "Leads all European operations. Focused on regional compliance.",
      contact_owner: getRandomOwner(),
      email: "elena.dubois@apex-solutions.co.uk",
      phone: "+44-20-7555-0204",
      mailing_street: "110 Bishopsgate",
      mailing_city: "London",
      mailing_zip_postal_code: "EC2N 4AY",
      mailing_country: "United Kingdom",
    },
  });

  const con_sanjay = await prisma.contacts.create({
    data: {
      account_id: acc_quantum.id,
      salutation: "Mr.",
      first_name: "Sanjay",
      last_name: "Narula",
      title: "Chief Executive Officer",
      description: "Drives all strategic partnerships.",
      contact_owner: getRandomOwner(),
      email: "sanjay.narula@quantumcore.com",
      phone: "+1-425-555-0205",
      mailing_street: "One Microsoft Way",
      mailing_city: "Redmond",
      mailing_state_province: "WA",
      mailing_zip_postal_code: "98052",
      mailing_country: "United States",
    },
  });

  const con_anna = await prisma.contacts.create({
    data: {
      account_id: acc_quantum.id,
      reports_to_contact_id: con_sanjay.id,
      salutation: "Ms.",
      first_name: "Anna",
      last_name: "Reed",
      title: "CFO",
      description: "Manages partner program budgets.",
      contact_owner: getRandomOwner(),
      email: "anna.reed@quantumcore.com",
      phone: "+1-425-555-0206",
      mailing_street: "One Microsoft Way",
      mailing_city: "Redmond",
      mailing_state_province: "WA",
      mailing_zip_postal_code: "98052",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_quantum.id,
      reports_to_contact_id: con_anna.id,
      salutation: "Mr.",
      first_name: "Alex",
      last_name: "Chen",
      title: "Partner Alliance Manager",
      description: "Our day-to-day contact for the co-sell initiative.",
      contact_owner: getRandomOwner(),
      email: "alex.chen@quantumcore.com",
      phone: "+1-425-555-0207",
      mailing_street: "One Microsoft Way",
      mailing_city: "Redmond",
      mailing_state_province: "WA",
      mailing_zip_postal_code: "98052",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_helios.id,
      salutation: "Mr.",
      first_name: "Lawrence",
      last_name: "Ellis",
      title: "Executive Chairman",
      description: "Founder and primary stakeholder. Not involved day-to-day.",
      contact_owner: getRandomOwner(),
      email: "lawrence.ellis@helios-db.com",
      phone: "+1-512-555-0208",
      mailing_street: "2300 Oracle Way",
      mailing_city: "Austin",
      mailing_state_province: "TX",
      mailing_zip_postal_code: "78741",
      mailing_country: "United States",
    },
  });

  const con_tobias = await prisma.contacts.create({
    data: {
      account_id: acc_ecommerce.id,
      salutation: "Mr.",
      first_name: "Tobias",
      last_name: "Lunde",
      title: "CEO & Founder",
      description:
        "Technical founder, still very hands-on with platform architecture.",
      contact_owner: getRandomOwner(),
      email: "tobias.lunde@ecomm-pioneers.ca",
      phone: "+1-613-555-0209",
      mailing_street: "151 O'Connor St",
      mailing_city: "Ottawa",
      mailing_state_province: "ON",
      mailing_zip_postal_code: "K2P 2L8",
      mailing_country: "Canada",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_ecommerce.id,
      reports_to_contact_id: con_tobias.id,
      salutation: "Mr.",
      first_name: "Harley",
      last_name: "Finkelstein",
      title: "President",
      description: "Focuses on business development and merchant success.",
      contact_owner: getRandomOwner(),
      email: "harley.f@ecomm-pioneers.ca",
      phone: "+1-613-555-0210",
      mailing_street: "151 O'Connor St",
      mailing_city: "Ottawa",
      mailing_state_province: "ON",
      mailing_zip_postal_code: "K2P 2L8",
      mailing_country: "Canada",
    },
  });

  const con_jensen = await prisma.contacts.create({
    data: {
      account_id: acc_momentum.id,
      salutation: "Mr.",
      first_name: "Jensen",
      last_name: "Huang",
      title: "President and CEO",
      description: "Key stakeholder for AI initiatives.",
      contact_owner: getRandomOwner(),
      email: "j.huang@momentum-ai.com",
      phone: "+1-408-555-0211",
      mailing_street: "2788 San Tomas Expy",
      mailing_city: "Santa Clara",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "95051",
      mailing_country: "United States",
    },
  });

  const con_colette = await prisma.contacts.create({
    data: {
      account_id: acc_momentum.id,
      reports_to_contact_id: con_jensen.id,
      salutation: "Ms.",
      first_name: "Colette",
      last_name: "Vress",
      title: "VP of Sales, Americas",
      description: "Leads sales for North America.",
      contact_owner: getRandomOwner(),
      email: "c.vress@momentum-ai.com",
      phone: "+1-408-555-0212",
      mailing_street: "2788 San Tomas Expy",
      mailing_city: "Santa Clara",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "95051",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_momentum.id,
      reports_to_contact_id: con_colette.id,
      salutation: "Mr.",
      first_name: "Mark",
      last_name: "Davis",
      title: "Sales Director, Cloud Platforms",
      description: "Primary point of contact for our PoC.",
      contact_owner: getRandomOwner(),
      email: "m.davis@momentum-ai.com",
      phone: "+1-408-555-0213",
      mailing_street: "2788 San Tomas Expy",
      mailing_city: "Santa Clara",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "95051",
      mailing_country: "United States",
    },
  });

  const con_jamie = await prisma.contacts.create({
    data: {
      account_id: acc_finsecure.id,
      salutation: "Mr.",
      first_name: "Jamie",
      last_name: "Diamond",
      title: "Chief Information Officer",
      description: "Economic decision maker for all IT spend.",
      contact_owner: getRandomOwner(),
      email: "jamie.diamond@finsecure.com",
      phone: "+1-212-555-0214",
      mailing_street: "270 Park Ave",
      mailing_city: "New York",
      mailing_state_province: "NY",
      mailing_zip_postal_code: "10017",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_finsecure.id,
      reports_to_contact_id: con_jamie.id,
      salutation: "Mr.",
      first_name: "Tom",
      last_name: "Wilson",
      title: "IT Manager, Infrastructure",
      description: "Technical lead for implementation.",
      contact_owner: getRandomOwner(),
      email: "tom.wilson@finsecure.com",
      phone: "+1-212-555-0215",
      mailing_street: "270 Park Ave",
      mailing_city: "New York",
      mailing_state_province: "NY",
      mailing_zip_postal_code: "10017",
      mailing_country: "United States",
    },
  });

  const con_doug = await prisma.contacts.create({
    data: {
      account_id: acc_summit.id,
      salutation: "Mr.",
      first_name: "Doug",
      last_name: "McMillan",
      title: "CEO",
      description: "Focus on global strategy and supply chain efficiency.",
      contact_owner: getRandomOwner(),
      email: "d.mcmillan@summit-retail.com",
      phone: "+1-479-555-0216",
      mailing_street: "702 SW 8th St",
      mailing_city: "Bentonville",
      mailing_state_province: "AR",
      mailing_zip_postal_code: "72716",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_summit_west.id,
      reports_to_contact_id: con_doug.id,
      salutation: "Ms.",
      first_name: "Sarah",
      last_name: "Caplan",
      title: "VP of Logistics, West",
      description: "Manages all West Coast distribution.",
      contact_owner: getRandomOwner(),
      email: "s.caplan@summit-retail.com",
      phone: "+1-213-555-0217",
      mailing_street: "800 N Alameda St",
      mailing_city: "Los Angeles",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "90012",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_horizon.id,
      salutation: "Dr.",
      first_name: "Aris",
      last_name: "Patel",
      title: "Chief Technology Officer",
      description:
        "Evaluating platforms for new patient portal. Needs strong security.",
      contact_owner: getRandomOwner(),
      email: "aris.patel@horizonhealth.com",
      phone: "+1-860-555-0218",
      mailing_street: "900 Cottage Grove Rd",
      mailing_city: "Bloomfield",
      mailing_state_province: "CT",
      mailing_zip_postal_code: "06002",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_nexus.id,
      salutation: "Ms.",
      first_name: "Chloe",
      last_name: "Mackenzie",
      title: "Senior Partner",
      description: "Key contact for all co-sell and integration projects.",
      contact_owner: getRandomOwner(),
      email: "chloe.mackenzie@nexus.consulting",
      phone: "+44-20-7555-0219",
      mailing_street: "2 New Street Square",
      mailing_city: "London",
      mailing_zip_postal_code: "EC4A 3BZ",
      mailing_country: "United Kingdom",
    },
  });

  const con_dr_ray = await prisma.contacts.create({
    data: {
      account_id: acc_cybergene.id,
      salutation: "Dr.",
      first_name: "Raymond",
      last_name: "Bishop",
      title: "Head of R&D",
      description: "Economic buyer for R&D software.",
      contact_owner: getRandomOwner(),
      email: "ray.bishop@cybergene.com",
      phone: "+1-650-555-0220",
      mailing_street: "1 DNA Way",
      mailing_city: "South San Francisco",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "94080",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_cybergene.id,
      reports_to_contact_id: con_dr_ray.id,
      salutation: "Dr.",
      first_name: "Susan",
      last_name: "Kim",
      title: "Senior Scientist",
      description: "Lead evaluator for data platform.",
      contact_owner: getRandomOwner(),
      email: "susan.kim@cybergene.com",
      phone: "+1-650-555-0221",
      mailing_street: "1 DNA Way",
      mailing_city: "South San Francisco",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "94080",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_aether.id,
      salutation: "Mr.",
      first_name: "Frank",
      last_name: "Hao",
      title: "VP of Engineering",
      description: "Looking for simulation and design software.",
      contact_owner: getRandomOwner(),
      email: "frank.hao@aether-aero.com",
      phone: "+1-703-555-0222",
      mailing_street: "929 N Stuart St",
      mailing_city: "Arlington",
      mailing_state_province: "VA",
      mailing_zip_postal_code: "22203",
      mailing_country: "United States",
    },
  });

  const con_jim = await prisma.contacts.create({
    data: {
      account_id: acc_vulcan.id,
      salutation: "Mr.",
      first_name: "Jim",
      last_name: "Halpert",
      title: "Chief Operating Officer",
      description: "Oversees all manufacturing plants.",
      contact_owner: getRandomOwner(),
      email: "jim.halpert@vulcan-mfg.com",
      phone: "+1-309-555-0223",
      mailing_street: "100 NE Adams St",
      mailing_city: "Peoria",
      mailing_state_province: "IL",
      mailing_zip_postal_code: "61629",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_vulcan.id,
      reports_to_contact_id: con_jim.id,
      salutation: "Ms.",
      first_name: "Maria",
      last_name: "Flores",
      title: "Plant Manager (Peoria)",
      description: "Will lead the pilot for the IoT solution.",
      contact_owner: getRandomOwner(),
      email: "maria.flores@vulcan-mfg.com",
      phone: "+1-309-555-0224",
      mailing_street: "100 NE Adams St",
      mailing_city: "Peoria",
      mailing_state_province: "IL",
      mailing_zip_postal_code: "61629",
      mailing_country: "United States",
    },
  });

  const con_wouter = await prisma.contacts.create({
    data: {
      account_id: acc_terra.id,
      salutation: "Mr.",
      first_name: "Wouter",
      last_name: "van den Berg",
      title: "CEO",
      description: "Driving renewable energy strategy.",
      contact_owner: getRandomOwner(),
      email: "w.vandenberg@terra-energy.com",
      phone: "+31-70-555-0225",
      mailing_street: "Carel van Bylandtlaan 16",
      mailing_city: "The Hague",
      mailing_zip_postal_code: "2596 HR",
      mailing_country: "Netherlands",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_terra.id,
      reports_to_contact_id: con_wouter.id,
      salutation: "Ms.",
      first_name: "Freya",
      last_name: "Jorgensen",
      title: "Head of Renewables",
      description: "Primary contact for new energy platform.",
      contact_owner: getRandomOwner(),
      email: "f.jorgensen@terra-energy.com",
      phone: "+31-70-555-0226",
      mailing_street: "Carel van Bylandtlaan 16",
      mailing_city: "The Hague",
      mailing_zip_postal_code: "2596 HR",
      mailing_country: "Netherlands",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_zenith_media.id,
      salutation: "Mr.",
      first_name: "Brian",
      last_name: "Roberts",
      title: "CEO",
      description: "Key decision maker for new tech acquisitions.",
      contact_owner: getRandomOwner(),
      email: "b.roberts@zenithmedia.com",
      phone: "+1-215-555-0227",
      mailing_street: "1701 John F Kennedy Blvd",
      mailing_city: "Philadelphia",
      mailing_state_province: "PA",
      mailing_zip_postal_code: "19103",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_everest.id,
      salutation: "Mr.",
      first_name: "Brendan",
      last_name: "Crowley",
      title: "CEO",
      description: "Final sign-off on all major software deals.",
      contact_owner: getRandomOwner(),
      email: "brendan.crowley@everest.com",
      phone: "+1-571-555-0228",
      mailing_street: "12011 Sunset Hills Rd",
      mailing_city: "Reston",
      mailing_state_province: "VA",
      mailing_zip_postal_code: "20190",
      mailing_country: "United States",
    },
  });

  await prisma.contacts.create({
    data: {
      account_id: acc_starlight.id,
      salutation: "Ms.",
      first_name: "Sarah",
      last_name: "Jones",
      title: "Producer",
      description: "Day-to-day contact for analytics package evaluation.",
      contact_owner: getRandomOwner(),
      email: "sarah.jones@starlight.film",
      phone: "+1-213-555-0229",
      mailing_street: "5555 Melrose Ave",
      mailing_city: "Los Angeles",
      mailing_state_province: "CA",
      mailing_zip_postal_code: "90038",
      mailing_country: "United States",
    },
  });

  console.log(`Created ${await prisma.contacts.count()} contacts.`);

  await prisma.opportunities.create({
    data: {
      account_id: acc_apex.id,
      name: "Apex Global - Core Platform Renewal",
      amount: new Decimal(2500000.0),
      close_date: getRelativeDate(20),
      description: "Annual renewal for enterprise-wide CRM license.",
      stage: "Closed Won",
      probability: new Decimal(100.0),
      forecast_category: "Closed",
      next_step: "Completed",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_apex.id,
      name: "Apex Global - Marketing Cloud Expansion",
      amount: new Decimal(750000.0),
      close_date: getRelativeDate(35),
      description:
        "Upsell opportunity for Marketing Cloud Pro to cover new acquisitions.",
      stage: "Negotiate",
      probability: new Decimal(90.0),
      forecast_category: "Commit",
      next_step: "Final pricing call with Brian Shaw (CTO)",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_apex_uk.id,
      name: "Apex UK - Service Cloud Rollout",
      amount: new Decimal(320000.0),
      close_date: getRelativeDate(50),
      description:
        "New implementation of Service Cloud for London call center.",
      stage: "Propose",
      probability: new Decimal(75.0),
      forecast_category: "Commit",
      next_step: "Present proposal to Elena Dubois.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_quantum.id,
      name: "QuantumCore - Azure Co-Sell Initiative",
      amount: new Decimal(1000000.0),
      close_date: getRelativeDate(60),
      description: "Strategic partnership for co-selling CRM on Azure.",
      stage: "Propose",
      probability: new Decimal(60.0),
      forecast_category: "Pipeline",
      next_step: "Joint presentation to partner board.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_ecommerce.id,
      name: "E-Commerce Pioneers - Payments Integration",
      amount: new Decimal(450000.0),
      close_date: getRelativeDate(80),
      description: "Integration of our payment services into their platform.",
      stage: "Needs Analysis",
      probability: new Decimal(50.0),
      forecast_category: "Best Case",
      next_step: "Technical workshop with Tobias Lunde.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_momentum.id,
      name: "Momentum AI - DGX Server Farm PoC",
      amount: new Decimal(200000.0),
      close_date: getRelativeDate(90),
      description:
        "Initial Proof of Concept for using our platform on their DGX hardware.",
      stage: "Qualify",
      probability: new Decimal(20.0),
      forecast_category: "Pipeline",
      next_step: "Schedule first discovery call with Mark Davis.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_helios.id,
      name: "Helios - Legacy System Support Contract",
      amount: new Decimal(50000.0),
      close_date: getRelativeDate(-30),
      description:
        "Attempted to win back support contract. Lost to internal team.",
      stage: "Closed Lost",
      probability: new Decimal(0.0),
      forecast_category: "Closed",
      next_step: "N/A",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_starlight.id,
      name: "Starlight - Studio Analytics Package",
      amount: new Decimal(180000.0),
      close_date: getRelativeDate(40),
      description: "Analytics package for box office and streaming data.",
      stage: "Needs Analysis",
      probability: new Decimal(50.0),
      forecast_category: "Best Case",
      next_step: "Demo with studio head.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_finsecure.id,
      name: "FinSecure - Core Banking Security Platform",
      amount: new Decimal(1200000.0),
      close_date: getRelativeDate(10),
      description: "Platform-wide security and compliance module.",
      stage: "Closed Won",
      probability: new Decimal(100.0),
      forecast_category: "Closed",
      next_step: "Completed",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_finsecure.id,
      name: "FinSecure - AI Fraud Detection Engine",
      amount: new Decimal(600000.0),
      close_date: getRelativeDate(100),
      description: "New opportunity for real-time AI fraud detection.",
      stage: "Needs Analysis",
      probability: new Decimal(40.0),
      forecast_category: "Pipeline",
      next_step: "Present case studies to Tom Wilson.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_summit.id,
      name: "Summit Retail - SCM Rollout",
      amount: new Decimal(3000000.0),
      close_date: getRelativeDate(120),
      description:
        "Full-scale Supply Chain Management platform for all NA stores.",
      stage: "Propose",
      probability: new Decimal(60.0),
      forecast_category: "Pipeline",
      next_step: "Finalize SOW with Doug McMillan.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_horizon.id,
      name: "Horizon Health - Patient Portal CRM",
      amount: new Decimal(950000.0),
      close_date: getRelativeDate(70),
      description: "CRM backend for new patient-facing portal.",
      stage: "Qualify",
      probability: new Decimal(25.0),
      forecast_category: "Pipeline",
      next_step: "Technical discovery call with Dr. Patel.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_cybergene.id,
      name: "Cybergene - R&D Data Platform",
      amount: new Decimal(400000.0),
      close_date: getRelativeDate(25),
      description: "Unified data platform for clinical trial analysis.",
      stage: "Negotiate",
      probability: new Decimal(85.0),
      forecast_category: "Commit",
      next_step: "Final review of terms with Dr. Ray Bishop.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_aether.id,
      name: "Aether - Simulation Software",
      amount: new Decimal(150000.0),
      close_date: getRelativeDate(55),
      description: "Cloud-based simulation software for new jet engine design.",
      stage: "Qualify",
      probability: new Decimal(20.0),
      forecast_category: "Pipeline",
      next_step: "Security and compliance review.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_vulcan.id,
      name: "Vulcan - IoT Fleet Management",
      amount: new Decimal(220000.0),
      close_date: getRelativeDate(65),
      description: "IoT solution for managing heavy equipment fleet.",
      stage: "Propose",
      probability: new Decimal(70.0),
      forecast_category: "Best Case",
      next_step: "On-site pilot with Maria Flores in Peoria.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_terra.id,
      name: "TerraEnergy - Green Energy Platform",
      amount: new Decimal(800000.0),
      close_date: getRelativeDate(95),
      description: "Platform to manage renewable energy assets.",
      stage: "Needs Analysis",
      probability: new Decimal(50.0),
      forecast_category: "Best Case",
      next_step: "Meet with Freya Jorgensen.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_zenith_media.id,
      name: "Zenith Media - Ad Sales CRM",
      amount: new Decimal(500000.0),
      close_date: getRelativeDate(-15),
      description: "Pitched new Ad Sales CRM. Lost to internal build.",
      stage: "Closed Lost",
      probability: new Decimal(0.0),
      forecast_category: "Closed",
      next_step: "N/A",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_everest.id,
      name: "Everest - Project Management Suite",
      amount: new Decimal(350000.0),
      close_date: getRelativeDate(5),
      description: "Enterprise license for project management tools.",
      stage: "Closed Won",
      probability: new Decimal(100.0),
      forecast_category: "Closed",
      next_step: "Completed",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_nexus.id,
      name: "Nexus - Global Integration Framework",
      amount: new Decimal(250000.0),
      close_date: getRelativeDate(110),
      description:
        "Framework for deploying our platform at scale for their clients.",
      stage: "Propose",
      probability: new Decimal(65.0),
      forecast_category: "Pipeline",
      next_step: "Finalize partner agreement with Chloe Mackenzie.",
      opportunity_owner: getRandomOwner(),
    },
  });

  await prisma.opportunities.create({
    data: {
      account_id: acc_alpha.id,
      name: "Alpha Education - Admissions Platform",
      amount: new Decimal(130000.0),
      close_date: getRelativeDate(85),
      description: "Full admissions and recruitment platform.",
      stage: "Qualify",
      probability: new Decimal(25.0),
      forecast_category: "Pipeline",
      next_step: "Initial demo with admissions board.",
      opportunity_owner: getRandomOwner(),
    },
  });

  console.log(`Created ${await prisma.opportunities.count()} opportunities.`);

  await prisma.leads.create({
    data: {
      salutation: "Dr.",
      first_name: "Elena",
      last_name: "Petrova",
      title: "Chief Research Officer",
      company: "BioGen Innovations",
      website: "https://biogen-innovations.com",
      description:
        "Met at PharmaTech conference. Interested in our data analysis platform for drug discovery. High potential.",
      email: "elena.petrova@biogen-innovations.com",
      phone: "+1-617-555-0301",
      street: "225 Binney St",
      city: "Cambridge",
      state_province: "MA",
      zip_postal_code: "02142",
      country: "United States",
      number_of_employees: 1500,
      annual_revenue: new Decimal(1200000000.0),
      industry: "Biotechnology",
      lead_source: "Trade Show",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Tariq",
      last_name: "Al-Fahim",
      title: "Head of Logistics",
      company: "QuickHaul Logistics",
      website: "https://quickhaul.ae",
      description:
        "Web form submission. Looking to optimize their freight forwarding fleet.",
      email: "tariq.alfahim@quickhaul.ae",
      phone: "+971-4-555-0302",
      street: "JAFZA One, Jebel Ali Free Zone",
      city: "Dubai",
      state_province: "Dubai",
      zip_postal_code: "17000",
      country: "United Arab Emirates",
      number_of_employees: 800,
      annual_revenue: new Decimal(95000000.0),
      industry: "Shipping",
      lead_source: "Web",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Ms.",
      first_name: "Chloe",
      last_name: "Nguyen",
      title: "Owner",
      company: "The Daily Brew",
      website: "https://dailybrew.com",
      description:
        "Small chain of 3 coffee shops. Budget is too low for enterprise plan. Marked as unqualified.",
      email: "chloe.n@dailybrew.com",
      phone: "+1-206-555-0303",
      street: "1912 Pike Pl",
      city: "Seattle",
      state_province: "WA",
      zip_postal_code: "98101",
      country: "United States",
      number_of_employees: 25,
      annual_revenue: new Decimal(1200000.0),
      industry: "Retail",
      lead_source: "Other",
      status: "Unqualified",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Kenji",
      last_name: "Watanabe",
      title: "Project Manager",
      company: "Cornerstone Construction",
      website: "https://cstone.com",
      description:
        "Referral from Everest Construction. Looking for project management tools.",
      email: "k.watanabe@cstone.com",
      phone: "+1-713-555-0304",
      street: "1100 Louisiana St",
      city: "Houston",
      state_province: "TX",
      zip_postal_code: "77002",
      country: "United States",
      number_of_employees: 3000,
      annual_revenue: new Decimal(450000000.0),
      industry: "Construction",
      lead_source: "External Referral",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Dr.",
      first_name: "Ismail",
      last_name: "Bello",
      title: "Dean of Admissions",
      company: "Lagos City University",
      website: "https://lagoscityuni.ng",
      description: "Needs a new student recruitment and admissions platform.",
      email: "ismail.bello@lagoscityuni.ng",
      phone: "+234-1-555-0305",
      street: "17, Commercial Avenue",
      city: "Lagos",
      state_province: "Lagos",
      zip_postal_code: "100242",
      country: "Nigeria",
      number_of_employees: 700,
      annual_revenue: new Decimal(50000000.0),
      industry: "Education",
      lead_source: "Seminar - Internal",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Ms.",
      first_name: "Ana",
      last_name: "Silva",
      title: "CFO",
      company: "Mercado Rio",
      website: "https://mercadorio.br",
      description: "Looking for financial planning software. Attended webinar.",
      email: "ana.silva@mercadorio.br",
      phone: "+55-21-5555-0306",
      street: "Av. Rio Branco, 1",
      city: "Rio de Janeiro",
      state_province: "RJ",
      zip_postal_code: "20090-003",
      country: "Brazil",
      number_of_employees: 500,
      annual_revenue: new Decimal(75000000.0),
      industry: "Retail",
      lead_source: "Seminar - Internal",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Chen",
      last_name: "Wei",
      title: "Supply Chain Director",
      company: "Volt Auto",
      website: "https://volt-auto.cn",
      description: "EV manufacturing, looking for SCM optimization.",
      email: "chen.wei@volt-auto.cn",
      phone: "+86-21-5555-0307",
      street: "No. 489, Diecai Road",
      city: "Shanghai",
      state_province: "Shanghai",
      zip_postal_code: "201203",
      country: "China",
      number_of_employees: 8000,
      annual_revenue: new Decimal(3000000000.0),
      industry: "Manufacturing",
      lead_source: "Partner",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Ms.",
      first_name: "Jasmine",
      last_name: "Bhullar",
      title: "Marketing Head",
      company: "River E-Commerce",
      website: "https://river.com",
      description: "Major e-commerce player. Interested in Marketing Cloud.",
      email: "jasmine.b@river.com",
      phone: "+1-206-555-0308",
      street: "410 Terry Ave N",
      city: "Seattle",
      state_province: "WA",
      zip_postal_code: "98109",
      country: "United States",
      number_of_employees: 500000,
      annual_revenue: new Decimal(400000000000.0),
      industry: "Retail",
      lead_source: "Advertisement",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Dr.",
      first_name: "Simon",
      last_name: "Laos",
      title: "Geologist",
      company: "Atlas Geospatial",
      website: "https://atlas-geo.com",
      description: "Needs data visualization tools for geological surveys.",
      email: "s.laos@atlas-geo.com",
      phone: "+1-303-555-0309",
      street: "1600 Broadway",
      city: "Denver",
      state_province: "CO",
      zip_postal_code: "80202",
      country: "United States",
      number_of_employees: 200,
      annual_revenue: new Decimal(30000000.0),
      industry: "Engineering",
      lead_source: "Word of mouth",
      status: "Qualified",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Liam",
      last_name: "Gallagher",
      title: "IT Manager",
      company: "Novartis",
      website: "https://novartis.com",
      description: "Employee referral. Looking to consolidate CRM vendors.",
      email: "liam.gallagher@novartis.com",
      phone: "+41-61-555-0310",
      street: "Fabrikstrasse 2",
      city: "Basel",
      state_province: "BS",
      zip_postal_code: "4056",
      country: "Switzerland",
      number_of_employees: 100000,
      annual_revenue: new Decimal(50000000000.0),
      industry: "Biotechnology",
      lead_source: "Employee Referral",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Ms.",
      first_name: "Maria",
      last_name: "Garcia",
      title: "VP, Operations",
      company: "PetroMex",
      website: "https://petromex.mx",
      description:
        "Met at energy summit. Interested in operational efficiency.",
      email: "m.garcia@petromex.mx",
      phone: "+52-55-5555-0311",
      street: "Av. Marina Nacional 329",
      city: "Mexico City",
      state_province: "CDMX",
      zip_postal_code: "11311",
      country: "Mexico",
      number_of_employees: 120000,
      annual_revenue: new Decimal(80000000000.0),
      industry: "Energy",
      lead_source: "Trade Show",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "John",
      last_name: "Deere",
      title: "Owner",
      company: "AgriFuture",
      website: "https://agrifuture.com",
      description: "Large-scale agriculture. Wants IoT for farm equipment.",
      email: "john.deere@agrifuture.com",
      phone: "+1-309-555-0312",
      street: "One John Deere Pl",
      city: "Moline",
      state_province: "IL",
      zip_postal_code: "61265",
      country: "United States",
      number_of_employees: 70000,
      annual_revenue: new Decimal(40000000000.0),
      industry: "Machinery",
      lead_source: "Partner",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Ms.",
      first_name: "Sarah",
      last_name: "Connor",
      title: "Student",
      company: "UCLA",
      website: "httpsUcla.edu",
      description: "Student looking for internship. Not a valid lead.",
      email: "s.connor@ucla.edu",
      phone: "+1-310-555-0313",
      street: "405 Hilgard Ave",
      city: "Los Angeles",
      state_province: "CA",
      zip_postal_code: "90095",
      country: "United States",
      number_of_employees: 1,
      annual_revenue: new Decimal(0.0),
      industry: "Education",
      lead_source: "Web",
      status: "Unqualified",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Patrick",
      last_name: "Bateman",
      title: "VP, Mergers & Acquisitions",
      company: "Pierce & Pierce",
      website: "https://pierce-pierce.com",
      description: "Inbound inquiry about Financial Services Cloud.",
      email: "p.bateman@pierce-pierce.com",
      phone: "+1-212-555-0314",
      street: "358 Exchange Pl",
      city: "New York",
      state_province: "NY",
      zip_postal_code: "10099",
      country: "United States",
      number_of_employees: 2000,
      annual_revenue: new Decimal(1000000000.0),
      industry: "Finance",
      lead_source: "Web",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Miles",
      last_name: "Dyson",
      title: "Director, Special Projects",
      company: "Cyberdyne Systems",
      website: "https://cyberdyne.com",
      description:
        "Met at AI conference. Very interested in neural net processing.",
      email: "miles.dyson@cyberdyne.com",
      phone: "+1-408-555-0315",
      street: "18144 El Camino Real",
      city: "Sunnyvale",
      state_province: "CA",
      zip_postal_code: "94087",
      country: "United States",
      number_of_employees: 3500,
      annual_revenue: new Decimal(2200000000.0),
      industry: "Technology",
      lead_source: "Trade Show",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Peter",
      last_name: "Gibbons",
      title: "Software Engineer",
      company: "Initech",
      website: "https://initech.com",
      description:
        "Looking for team collaboration tools. Seems to be a low-level contact.",
      email: "peter.gibbons@initech.com",
      phone: "+1-512-555-0316",
      street: "4120 Freidrich Ln",
      city: "Austin",
      state_province: "TX",
      zip_postal_code: "78744",
      country: "United States",
      number_of_employees: 600,
      annual_revenue: new Decimal(80000000.0),
      industry: "Technology",
      lead_source: "Employee Referral",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Art",
      last_name: "Vandelay",
      title: "Importer/Exporter",
      company: "Vandelay Industries",
      website: "https://vandelay.com",
      description:
        "Inquired about logistics and import/export tracking. Small business.",
      email: "art.vandelay@vandelay.com",
      phone: "+1-212-555-0317",
      street: "129 W 81st St",
      city: "New York",
      state_province: "NY",
      zip_postal_code: "10024",
      country: "United States",
      number_of_employees: 5,
      annual_revenue: new Decimal(800000.0),
      industry: "Shipping",
      lead_source: "Web",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Tony",
      last_name: "Stark",
      title: "CEO",
      company: "Stark Industries",
      website: "https://stark.com",
      description: "Wants a demo of our AI platform. High profile.",
      email: "tony.stark@stark.com",
      phone: "+1-212-555-0318",
      street: "10880 Malibu Point",
      city: "Malibu",
      state_province: "CA",
      zip_postal_code: "90265",
      country: "United States",
      number_of_employees: 100000,
      annual_revenue: new Decimal(200000000000.0),
      industry: "Engineering",
      lead_source: "Public Relations",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Dr.",
      first_name: "Eldon",
      last_name: "Tyrell",
      title: "CEO",
      company: "Tyrell Corporation",
      website: "https://tyrell.com",
      description: "Interested in our biotech data management platform.",
      email: "eldon.tyrell@tyrell.com",
      phone: "+1-213-555-0319",
      street: "200 N Spring St",
      city: "Los Angeles",
      state_province: "CA",
      zip_postal_code: "90012",
      country: "United States",
      number_of_employees: 50000,
      annual_revenue: new Decimal(150000000000.0),
      industry: "Biotechnology",
      lead_source: "External Referral",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "William",
      last_name: "Thorne",
      title: "CEO",
      company: "Soylent Corporation",
      website: "https://soylent.com",
      description:
        "Wants solutions for food production supply chain. Unresponsive after initial call.",
      email: "william.thorne@soylent.com",
      phone: "+1-212-555-0320",
      street: "11 Water St",
      city: "New York",
      state_province: "NY",
      zip_postal_code: "10004",
      country: "United States",
      number_of_employees: 12000,
      annual_revenue: new Decimal(2000000000.0),
      industry: "Food & Beverage",
      lead_source: "Other",
      status: "Unqualified",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Bruce",
      last_name: "Wayne",
      title: "CEO",
      company: "Wayne Enterprises",
      website: "https://wayne.com",
      description:
        "Inquiry about platform security and custom hardware integrations.",
      email: "bruce.wayne@wayne.com",
      phone: "+1-212-555-0321",
      street: "1007 Mountain Dr",
      city: "Gotham City",
      state_province: "NY",
      zip_postal_code: "10001",
      country: "United States",
      number_of_employees: 200000,
      annual_revenue: new Decimal(300000000000.0),
      industry: "Manufacturing",
      lead_source: "Web",
      status: "New",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Richard",
      last_name: "Hendricks",
      title: "CEO",
      company: "Pied Piper",
      website: "https://piedpiper.com",
      description: "Downloaded whitepaper on data compression algorithms.",
      email: "richard.hendricks@piedpiper.com",
      phone: "+1-650-555-0322",
      street: "5230 Newell Rd",
      city: "Palo Alto",
      state_province: "CA",
      zip_postal_code: "94303",
      country: "United States",
      number_of_employees: 50,
      annual_revenue: new Decimal(10000000.0),
      industry: "Technology",
      lead_source: "Web",
      status: "Contacted",
      lead_owner: getRandomOwner(),
    },
  });

  await prisma.leads.create({
    data: {
      salutation: "Mr.",
      first_name: "Hank",
      last_name: "Scorpio",
      title: "President",
      company: "Globex Corporation",
      website: "https://globex.com",
      description: "Needs a new global HR platform. Very enthusiastic.",
      email: "hank.scorpio@globex.com",
      phone: "+1-509-555-0323",
      street: "1 Globex Ct",
      city: "Cypress Creek",
      state_province: "WA",
      zip_postal_code: "99001",
      country: "United States",
      number_of_employees: 15000,
      annual_revenue: new Decimal(5000000000.0),
      industry: "Other",
      lead_source: "Word of mouth",
      status: "Nurturing",
      lead_owner: getRandomOwner(),
    },
  });

  console.log(`Created ${await prisma.leads.count()} leads.`);
  console.log("High-fidelity seeding finished.");
}
