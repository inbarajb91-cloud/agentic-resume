'use client'

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts
Font.register({
    family: 'Inter',
    src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf'
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#333'
    },
    header: {
        marginBottom: 20,
        textAlign: 'center'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    contact: {
        fontSize: 9,
        color: '#666',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20
    },
    section: {
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 2,
        marginBottom: 8,
        color: '#000'
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    expTitle: {
        fontWeight: 'bold',
        fontSize: 11
    },
    expOrg: {
        fontSize: 10,
        fontStyle: 'italic',
        marginBottom: 4
    },
    bullet: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10
    },
    bulletPoint: {
        width: 10,
        fontSize: 10
    },
    bulletText: {
        flex: 1
    }
})

export function ResumePDF({ content, profile }: { content: any, profile: any }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{profile.full_name || content.name}</Text>
                    <View style={styles.contact}>
                        <Text>{profile.email}</Text>
                        {/* Always show full phone in PDF version if available */}
                        <Text>{profile.phone || content.phone}</Text>
                        <Text>{content.location}</Text>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>{content.summary}</Text>
                </View>

                {/* Experience */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {content.tailored_experiences?.map((exp: any, i: number) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <View style={styles.expHeader}>
                                <Text style={styles.expTitle}>{exp.title}</Text>
                                <Text>{exp.start_date} - {exp.end_date || 'Present'}</Text>
                            </View>
                            <Text style={styles.expOrg}>{exp.organization}</Text>
                            {exp.bullets.map((bullet: string, j: number) => (
                                <View key={j} style={styles.bullet}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Skills */}
                {content.skills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text>{content.skills.join(' • ')}</Text>
                    </View>
                )}
            </Page>
        </Document>
    )
}
