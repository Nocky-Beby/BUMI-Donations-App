import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.reportSnapshot.deleteMany();
  await prisma.distribution.deleteMany();
  await prisma.donationTracking.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.need.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = bcrypt.hashSync("password123", 10);

  const [donor, admin, manager, partnerUser] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Gloria Donatrice",
        email: "donateur@bumi.org",
        phone: "+243 99 000 0001",
        passwordHash,
        role: "DONOR",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Admin BUMI",
        email: "admin@bumi.org",
        phone: "+243 99 000 0002",
        passwordHash,
        role: "ADMIN",
        organization: "Orphelinat BUMI",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Responsable BUMI",
        email: "responsable@bumi.org",
        phone: "+243 99 000 0003",
        passwordHash,
        role: "MANAGER",
        organization: "Orphelinat BUMI",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        fullName: "Partenaire Solidaire",
        email: "partenaire@bumi.org",
        phone: "+243 99 000 0004",
        passwordHash,
        role: "PARTNER",
        organization: "ONG Partenaire",
        status: "ACTIVE",
      },
    }),
  ]);

  const [partnerA, partnerB] = await Promise.all([
    prisma.partner.create({
      data: {
        name: "Fondation Mwana",
        contactPerson: "Sarah Ilunga",
        email: "contact@foundation-mwana.org",
        phone: "+243 81 000 1000",
        sector: "ONG",
        status: "ACTIVE",
      },
    }),
    prisma.partner.create({
      data: {
        name: "Entreprise Espoir",
        contactPerson: "Patrick Mwamba",
        email: "impact@entreprise-espoir.cd",
        phone: "+243 97 000 2000",
        sector: "Entreprise",
        status: "ACTIVE",
      },
    }),
  ]);

  const [need1, need2, need3, need4] = await Promise.all([
    prisma.need.create({
      data: {
        title: "Fournitures scolaires 2026",
        category: "Éducation",
        description: "Fournir des kits scolaires, uniformes et cahiers à 200 enfants.",
        imageUrl: "/images/needs-education.jpg",
        priority: "URGENT",
        targetAmount: 15000000,
        currentAmount: 12450000,
        unit: "FC",
        status: "PUBLISHED",
        updatedById: manager.id,
      },
    }),
    prisma.need.create({
      data: {
        title: "Soins médicaux d'urgence",
        category: "Santé",
        description: "Prise en charge médicale d’urgence pour 50 enfants vulnérables.",
        imageUrl: "/images/hero-children.jpg",
        priority: "HIGH",
        targetAmount: 25000000,
        currentAmount: 8750000,
        unit: "FC",
        status: "PUBLISHED",
        updatedById: manager.id,
      },
    }),
    prisma.need.create({
      data: {
        title: "Programme nutrition",
        category: "Nutrition",
        description: "Repas équilibrés et compléments nutritionnels pour 150 enfants.",
        imageUrl: "/images/about-children.jpg",
        priority: "MEDIUM",
        targetAmount: 20000000,
        currentAmount: 20000000,
        unit: "FC",
        status: "SATISFIED",
        updatedById: manager.id,
      },
    }),
    prisma.need.create({
      data: {
        title: "Construction salle de classe",
        category: "Infrastructure",
        description: "Aménager une nouvelle salle de classe pour 40 élèves.",
        imageUrl: "/images/needs-education.jpg",
        priority: "HIGH",
        targetAmount: 35000000,
        currentAmount: 14200000,
        unit: "FC",
        status: "PUBLISHED",
        updatedById: manager.id,
      },
    }),
  ]);

  const donation1 = await prisma.donation.create({
    data: {
      userId: donor.id,
      needId: need1.id,
      type: "CASH",
      amount: 150,
      currency: "USD",
      description: "Contribution pour les fournitures scolaires.",
      source: "PLATFORM",
      status: "VALIDATED",
      donorLabel: donor.fullName,
      validatedAt: new Date(new Date().setMonth(new Date().getMonth() - 2) + 86400000),
      validatedById: admin.id,
      createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    },
  });

  const donation2 = await prisma.donation.create({
    data: {
      userId: partnerUser.id,
      needId: need2.id,
      type: "CASH",
      amount: 500000,
      currency: "CDF",
      description: "Appui urgent pour les soins médicaux.",
      source: "PARTNER",
      status: "ALLOCATED",
      donorLabel: partnerUser.organization,
      allocatedAt: new Date(new Date().setMonth(new Date().getMonth() - 1) + 172800000),
      allocatedById: manager.id,
      createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
  });

  await prisma.donationTracking.createMany({
    data: [
      {
        donationId: donation1.id,
        status: "SUBMITTED",
        message: "Don enregistré sur la plateforme.",
        actorId: donor.id,
        actorLabel: donor.fullName,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
      },
      {
        donationId: donation1.id,
        status: "VALIDATED",
        message: "Don validé par l’administration BUMI.",
        actorId: admin.id,
        actorLabel: admin.fullName,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2) + 86400000),
      },
      {
        donationId: donation2.id,
        status: "SUBMITTED",
        message: "Contribution partenaire enregistrée.",
        actorId: partnerUser.id,
        actorLabel: partnerUser.organization,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
      {
        donationId: donation2.id,
        status: "ALLOCATED",
        message: "Affectation réalisée pour les soins médicaux d'urgence.",
        actorId: manager.id,
        actorLabel: manager.fullName,
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1) + 172800000),
      },
    ],
  });

  await prisma.distribution.create({
    data: {
      donationId: donation2.id,
      needId: need2.id,
      amount: 300000,
      beneficiaryGroup: "Enfants internes de BUMI",
      notes: "Distribution pour le ravitaillement médical mensuel.",
      status: "COMPLETED",
      distributedById: manager.id,
      distributedAt: new Date(new Date().setMonth(new Date().getMonth() - 1) + 172800000),
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: donor.id,
        type: "DONATION_STATUS",
        title: "Don validé",
        message: "Votre contribution pour les fournitures scolaires a été validée avec succès.",
        channel: "IN_APP",
        status: "IN_APP_ONLY",
      },
      {
        userId: partnerUser.id,
        type: "DONATION_ALLOCATED",
        title: "Don affecté à un besoin",
        message: "Votre contribution partenaire a été affectée au besoin « Soins médicaux d'urgence ».",
        channel: "IN_APP",
        status: "IN_APP_ONLY",
      },
    ],
  });

  await prisma.reportSnapshot.create({
    data: {
      name: "Rapport mensuel des dons",
      type: "MONTHLY",
      payload: JSON.stringify({
        totalDonors: 2,
        totalPartners: 1,
        totalDonationsValue: 970000,
        openNeeds: 3,
      }),
      createdById: admin.id,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: "SEED_INIT",
        entityType: "system",
        entityId: null,
        details: JSON.stringify({ project: "BUMI", version: "sqlite-prisma-v4" }),
      },
      {
        actorId: manager.id,
        action: "UPDATE_NEEDS_CATALOG",
        entityType: "needs",
        entityId: need1.id,
        details: JSON.stringify({ title: need1.title }),
      },
    ],
  });

  console.log("🌱 Seed Prisma BUMI terminée.");
  console.log("Comptes de test :");
  console.log("donateur@bumi.org / password123 / donor");
  console.log("admin@bumi.org / password123 / admin");
  console.log("responsable@bumi.org / password123 / manager");
  console.log("partenaire@bumi.org / password123 / partner");
  console.log("Devises supportees : FC / CDF et USD pour les dons en especes.");
  console.log(`Partenaires seeded: ${partnerA.name}, ${partnerB.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
