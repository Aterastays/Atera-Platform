import { jsPDF } from "jspdf";

export interface StaysFormData {
  landlordName: string;
  landlordAddress: string;
  propertyAddress: string;
  propertyType: string;
  bedrooms: string;
  freeholder: string;
  mortgageLender: string;
  insurer: string;
  monthlyRent: string;
  paymentDay: string;
  deposit: string;
  minorRepairsCap: string;
  startDate: string;
  term: string;
  breakNotice: string;
  breakAfter: string;
  directorName: string;
  companyNumber: string;
}

export interface ManagementFormData {
  landlordName: string;
  landlordAddress: string;
  propertyAddress: string;
  propertyType: string;
  bedrooms: string;
  managementFee: string;
  startDate: string;
  term: string;
  minorRepairsCap: string;
  remittanceDays: string;
  directorName: string;
  companyNumber: string;
}

function generateBasePDF(title: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Header rule
  doc.setFillColor(201, 168, 76); // Gold
  doc.rect(0, 0, 210, 5, "F");

  // Header Box
  doc.setFillColor(248, 246, 242); // Cream
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.rect(10, 15, 190, 25, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  doc.text("ATERA INDUSTRIES LTD", 105, 23, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  doc.text(title, 105, 29, { align: "center" });
  doc.text("PRIVATE & CONFIDENTIAL", 105, 34, { align: "center" });
  
  const date = new Date().toLocaleDateString("en-GB");
  doc.setFontSize(7.5);
  doc.text(`Generated: ${date}`, 195, 38, { align: "right" });

  return doc;
}

function addFooter(doc: jsPDF, pageCount: number) {
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Footer bottom 10mm
    doc.setFillColor(248, 246, 242);
    doc.rect(0, 287, 210, 10, "F");
    
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(0, 287, 210, 287);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.setTextColor(102, 102, 102);
    doc.text("ATERA INDUSTRIES LTD — Confidential — Requires independent legal review before execution", 105, 292, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, 200, 292, { align: "right" });
  }
}

export function generateStaysAgreement(data: StaysFormData) {
  const doc = generateBasePDF("STAYS PARTNERSHIP AGREEMENT");
  
  let y = 50;
  
  // Section: Details
  doc.setFillColor(201, 168, 76);
  doc.rect(10, y, 190, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("AGREEMENT DETAILS", 14, y + 4);
  
  y += 10;
  
  doc.setTextColor(102, 102, 102);
  doc.text("Landlord:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(data.landlordName, 40, y);
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 102, 102);
  doc.text("Property:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.propertyAddress} (${data.bedrooms} Bed ${data.propertyType})`, 40, y);
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 102, 102);
  doc.text("Monthly Rent:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`£${data.monthlyRent} (payable on ${data.paymentDay} of month)`, 40, y);

  y += 15;
  doc.setFillColor(201, 168, 76);
  doc.rect(10, y, 190, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TERMS AND CONDITIONS", 14, y + 4);
  
  y += 10;
  
  const clauses = [
    { title: "1. Permissions Condition Precedent", text: `This Agreement is conditional upon the Landlord obtaining written consent from any relevant Freeholder (${data.freeholder}), Mortgage Lender (${data.mortgageLender}) and Insurer (${data.insurer}) prior to commencement. Failure to obtain such consents shall render this Agreement void without liability on either party.` },
    { title: "2. Rent and Payment", text: `The Company shall pay to the Landlord the monthly rent of £${data.monthlyRent} on the ${data.paymentDay} day of each calendar month by bank transfer. Payment shall be made regardless of the occupancy status of the Property.` },
    { title: "3. Permitted Use", text: `The Company shall use the Property solely for the purpose of short-term serviced accommodation lettings. The Landlord acknowledges the requirements of the Deregulation Act 2015 regarding the 90-night annual limit for short-term letting in Greater London, where applicable.` },
    { title: "4. Maintenance", text: `The Company shall maintain the Property in good and tenantable condition throughout the Term. The Company shall be responsible for minor repairs up to £${data.minorRepairsCap} per occurrence. Structural repairs and major works shall remain the responsibility of the Landlord.` },
    { title: "5. Safety Compliance", text: `The Company shall ensure compliance with the Gas Safety (Installation and Use) Regulations 1998, the Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020, and the Smoke and Carbon Monoxide Alarm (Amendment) Regulations 2022 throughout the Term.` },
    { title: "6. Insurance", text: `The Landlord shall maintain buildings insurance and, where applicable, landlord's contents insurance for the Property throughout the Term. The Company shall maintain public liability insurance of no less than £5,000,000.` },
    { title: "7. Indemnity", text: `The Company shall indemnify the Landlord against any claims arising from the Company's use of the Property and against any loss or damage caused by guests procured by the Company, subject to fair wear and tear.` },
    { title: "8. Termination", text: `Either party may terminate this Agreement by giving not less than ${data.breakNotice} months' written notice, such notice not to be given before the expiry of ${data.breakAfter} months from the Commencement Date. Termination shall not affect any accrued rights or obligations.` },
    { title: "9. Compliance with Law", text: `Both parties shall comply with all applicable legislation governing the letting and use of residential property in England and Wales, including but not limited to the Renters (Reform) Act 2025, the Housing Act 1988 (as amended), and the Landlord and Tenant Act 1985.` },
    { title: "10. Governing Law", text: `This Agreement shall be governed by and construed in accordance with the laws of England and Wales. Any dispute shall be submitted to the exclusive jurisdiction of the courts of England and Wales.` }
  ];

  clauses.forEach((clause) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(201, 168, 76);
    doc.text(clause.title, 10, y);
    y += 5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 20, 20);
    const splitText = doc.splitTextToSize(clause.text, 190);
    doc.text(splitText, 10, y);
    y += (splitText.length * 4) + 6;
  });

  if (y > 230) {
    doc.addPage();
    y = 20;
  } else {
    y += 10;
  }

  // Signature Block
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(10, y, 200, y);
  y += 6;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("EXECUTION", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(7.5);
  doc.text("SIGNED by the Landlord", 10, y);
  doc.text("SIGNED for and on behalf of ATERA INDUSTRIES LTD", 110, y);
  
  y += 15;
  doc.setDrawColor(221, 221, 221);
  doc.line(10, y, 90, y);
  doc.line(110, y, 190, y);
  
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.landlordName}`, 10, y);
  doc.text(`Name: ${data.directorName}`, 110, y);
  
  y += 5;
  doc.text("Date: _________________________", 10, y);
  doc.text(`Company Number: ${data.companyNumber}`, 110, y);

  const pageCount = (doc.internal as any).getNumberOfPages();
  addFooter(doc, pageCount);

  doc.save("Atera_Stays_Agreement.pdf");
}

export function generateManagementAgreement(data: ManagementFormData) {
  const doc = generateBasePDF("PROPERTY MANAGEMENT AGREEMENT");
  
  let y = 50;
  
  doc.setFillColor(201, 168, 76);
  doc.rect(10, y, 190, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("AGREEMENT DETAILS", 14, y + 4);
  
  y += 10;
  
  doc.setTextColor(102, 102, 102);
  doc.text("Landlord:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(data.landlordName, 40, y);
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 102, 102);
  doc.text("Property:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.propertyAddress} (${data.bedrooms} Bed ${data.propertyType})`, 40, y);
  
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(102, 102, 102);
  doc.text("Management Fee:", 10, y);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.managementFee}% of gross monthly rent`, 40, y);

  y += 15;
  doc.setFillColor(201, 168, 76);
  doc.rect(10, y, 190, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TERMS AND CONDITIONS", 14, y + 4);
  
  y += 10;
  
  const clauses = [
    { title: "1. Appointment and Authority", text: `The Landlord hereby appoints the Company as sole and exclusive managing agent for the Property for the Term of this Agreement. The Company is authorised to act on the Landlord's behalf in all matters relating to the management of the Property.` },
    { title: "2. Management Fee", text: `The Company shall charge a management fee of ${data.managementFee}% of the gross monthly rent collected, deducted prior to remittance to the Landlord. The fee covers all management services set out in this Agreement.` },
    { title: "3. Tenant Find and Referencing", text: `The Company shall market the Property, conduct viewings, carry out full tenant referencing (including credit checks, employment verification and Right to Rent checks), and prepare all tenancy documentation on the Landlord's behalf.` },
    { title: "4. Rent Collection and Arrears", text: `The Company shall collect rent on behalf of the Landlord and remit net proceeds within ${data.remittanceDays} working days of receipt. In the event of arrears, the Company shall undertake reasonable recovery steps and keep the Landlord informed.` },
    { title: "5. Inspections and Reporting", text: `The Company shall conduct quarterly inspections of the Property and provide the Landlord with a written report including photographic evidence within 7 days of each inspection.` },
    { title: "6. Maintenance", text: `The Company is authorised to arrange and commission maintenance work up to £${data.minorRepairsCap} per occurrence without prior Landlord approval. All works above this threshold shall require Landlord consent before proceeding.` },
    { title: "7. Safety Compliance", text: `The Company shall arrange and maintain current Gas Safety Certificates, Electrical Installation Condition Reports (EICRs), Energy Performance Certificates (EPCs), and Smoke and CO Alarm compliance in accordance with current legislation.` },
    { title: "8. Deposit Handling", text: `All tenant deposits shall be registered with a government-approved Tenancy Deposit Scheme within the statutory timeframe. The Company shall manage all deposit disputes and deductions on the Landlord's behalf.` },
    { title: "9. Termination", text: `Either party may terminate this Agreement by giving not less than 2 months' written notice. Upon termination, the Company shall provide a full handover including keys, documentation, and outstanding financial statements within 14 days.` },
    { title: "10. Governing Law", text: `This Agreement shall be governed by and construed in accordance with the laws of England and Wales. Any dispute arising shall be subject to the exclusive jurisdiction of the courts of England and Wales.` }
  ];

  clauses.forEach((clause) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(201, 168, 76);
    doc.text(clause.title, 10, y);
    y += 5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(20, 20, 20);
    const splitText = doc.splitTextToSize(clause.text, 190);
    doc.text(splitText, 10, y);
    y += (splitText.length * 4) + 6;
  });

  if (y > 230) {
    doc.addPage();
    y = 20;
  } else {
    y += 10;
  }

  // Signature Block
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.5);
  doc.line(10, y, 200, y);
  y += 6;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text("EXECUTION", 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(7.5);
  doc.text("SIGNED by the Landlord", 10, y);
  doc.text("SIGNED for and on behalf of ATERA INDUSTRIES LTD", 110, y);
  
  y += 15;
  doc.setDrawColor(221, 221, 221);
  doc.line(10, y, 90, y);
  doc.line(110, y, 190, y);
  
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.landlordName}`, 10, y);
  doc.text(`Name: ${data.directorName}`, 110, y);
  
  y += 5;
  doc.text("Date: _________________________", 10, y);
  doc.text(`Company Number: ${data.companyNumber}`, 110, y);

  const pageCount = (doc.internal as any).getNumberOfPages();
  addFooter(doc, pageCount);

  doc.save("Atera_Management_Agreement.pdf");
}
