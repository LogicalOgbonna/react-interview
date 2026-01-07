'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import {
  CVData,
  CVEducation,
  CVExperience,
  CVProject,
  CVLeadership,
  CVSkillsSection,
  CVCustomSection,
} from '@/data/cv-types';

// Register a Times-like font family with proper font weights
Font.register({
  family: 'Times',
  fonts: [
    { src: 'Times-Roman' },
    { src: 'Times-Bold', fontWeight: 'bold' },
    { src: 'Times-Italic', fontStyle: 'italic' },
    { src: 'Times-BoldItalic', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});

const createStyles = (cvData: CVData) =>
  StyleSheet.create({
    page: {
      padding: '0.5in 0.6in',
      fontFamily: 'Times',
      fontSize: cvData.styles.fontSize,
      lineHeight: cvData.styles.lineHeight,
      color: cvData.styles.textColor,
    },
    header: {
      textAlign: 'center',
      marginBottom: 12,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: cvData.styles.textColor,
    },
    name: {
      fontSize: cvData.styles.nameFontSize,
      fontFamily: 'Times',
      fontWeight: 'bold',
      marginBottom: 3,
    },
    contactLine: {
      fontSize: 10,
    },
    section: {
      marginBottom: 10,
    },
    sectionHeader: {
      borderBottomWidth: 1,
      borderBottomColor: cvData.styles.textColor,
      paddingBottom: 2,
      marginBottom: 6,
    },
    sectionTitle: {
      fontSize: cvData.styles.sectionTitleFontSize,
      fontFamily: 'Times',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemLeft: {
      flex: 1,
    },
    itemRight: {
      textAlign: 'right',
    },
    primaryText: {
      fontFamily: 'Times',
      fontWeight: 'bold',
      color: cvData.styles.primaryColor,
    },
    accentText: {
      fontFamily: 'Times',
      color: cvData.styles.primaryColor,
      fontStyle: 'italic',
    },
    italicText: {
      fontFamily: 'Times',
      fontStyle: 'italic',
      color: cvData.styles.primaryColor,
    },
    bulletList: {
      marginTop: 3,
      marginLeft: 12,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    bulletMarker: {
      width: 10,
    },
    bulletText: {
      flex: 1,
    },
    customField: {
      flexDirection: 'row',
      marginBottom: 3,
    },
    labelBold: {
      fontFamily: 'Times',
      fontWeight: 'bold',
    },
    item: {
      marginBottom: 8,
    },
  });

interface CVPdfDocumentProps {
  data: CVData;
}

// Education Section Component
const EducationPdf = ({ items, styles }: { items: CVEducation[]; styles: ReturnType<typeof createStyles> }) => (
  <>
    {items.map((edu) => (
      <View key={edu.id} style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.primaryText}>{edu.university}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{edu.city}, {edu.state}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.italicText}>{edu.degree}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text>
              <Text style={styles.labelBold}>Graduation Date: </Text>
              <Text style={styles.accentText}>{edu.graduationDate}</Text>
            </Text>
          </View>
        </View>
      </View>
    ))}
  </>
);

// Work Experience Section Component
const WorkExperiencePdf = ({ items, styles }: { items: CVExperience[]; styles: ReturnType<typeof createStyles> }) => (
  <>
    {items.map((exp) => (
      <View key={exp.id} style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.primaryText}>{exp.company}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{exp.city}, {exp.state}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.italicText}>{exp.jobTitle}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{exp.startDate} - {exp.endDate}</Text>
          </View>
        </View>
        <View style={styles.bulletList}>
          {exp.bullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
  </>
);

// Project Section Component
const ProjectPdf = ({ items, styles }: { items: CVProject[]; styles: ReturnType<typeof createStyles> }) => (
  <>
    {items.map((proj) => (
      <View key={proj.id} style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.primaryText}>{proj.organization}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{proj.city}, {proj.state}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.italicText}>{proj.title}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{proj.startDate} - {proj.endDate}</Text>
          </View>
        </View>
        <View style={styles.bulletList}>
          {proj.experiences.map((exp, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletText}>{exp}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
  </>
);

// Leadership Section Component
const LeadershipPdf = ({ items, styles }: { items: CVLeadership[]; styles: ReturnType<typeof createStyles> }) => (
  <>
    {items.map((lead) => (
      <View key={lead.id} style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.primaryText}>{lead.organization}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{lead.city}, {lead.state}</Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.italicText}>{lead.title}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.accentText}>{lead.startDate} - {lead.endDate}</Text>
          </View>
        </View>
        <View style={styles.bulletList}>
          {lead.experiences.map((exp, idx) => (
            <View key={idx} style={styles.bulletItem}>
              <Text style={styles.bulletMarker}>•</Text>
              <Text style={styles.bulletText}>{exp}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}
  </>
);

// Skills Section Component
const SkillsPdf = ({ section, styles }: { section: CVSkillsSection; styles: ReturnType<typeof createStyles> }) => (
  <>
    {section.categories.map((cat) => (
      <View key={cat.id} style={styles.customField}>
        <Text style={styles.labelBold}>{cat.label}: </Text>
        <Text>{cat.value}</Text>
      </View>
    ))}
  </>
);

// Custom Section Component
const CustomPdf = ({ section, styles }: { section: CVCustomSection; styles: ReturnType<typeof createStyles> }) => (
  <>
    {section.fields.map((field) => (
      <View key={field.id} style={styles.customField}>
        <Text>{field.content}</Text>
      </View>
    ))}
  </>
);

export const CVPdfDocument = ({ data }: CVPdfDocumentProps) => {
  const styles = createStyles(data);
  const sortedSections = [...data.sections].sort((a, b) => a.order - b.order);

  const renderSection = (sectionId: string, sectionType: string) => {
    switch (sectionType) {
      case 'education':
        return <EducationPdf items={data.education} styles={styles} />;
      case 'work-experience':
        return <WorkExperiencePdf items={data.workExperience} styles={styles} />;
      case 'project-experience':
        return <ProjectPdf items={data.projectExperience} styles={styles} />;
      case 'leadership':
        return <LeadershipPdf items={data.leadership} styles={styles} />;
      case 'skills':
        const skillsSection = data.skillsSections?.find((s) => s.id === sectionId);
        if (!skillsSection) return null;
        return <SkillsPdf section={skillsSection} styles={styles} />;
      case 'custom':
        const customSection = data.customSections.find((s) => s.id === sectionId);
        if (!customSection) return null;
        return <CustomPdf section={customSection} styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <Text style={styles.contactLine}>{data.personalInfo.contactLine}</Text>
        </View>

        {/* Sections */}
        {sortedSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {renderSection(section.id, section.type)}
          </View>
        ))}
      </Page>
    </Document>
  );
};

