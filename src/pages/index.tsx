import Layout from '@theme/Layout';

import { GlobalPluginData } from '@docusaurus/plugin-content-docs/client';
import { usePluginData } from '@docusaurus/useGlobalData';
import LectureSummary from '../components/LectureSummary';
import { Alert, Box, Heading, Text } from '@chakra-ui/react';
import { Blockquote } from "@chakra-ui/react"
import { Highlight } from 'prism-react-renderer';
import { LuConstruction } from 'react-icons/lu';

export default function Hello() {
    const pluginData = usePluginData('docusaurus-plugin-content-docs') as GlobalPluginData;
    return (
        <Layout title="Course Overview" description="CS 3100 Course Overview">
            <Box p={4}>
                <Heading size='xl'>CS 3100: Program Design and Implementation II</Heading>
                <Blockquote.Root>
                    <Blockquote.Content>
                        Building on foundations introduced in CS 2100, examines program design at increasing scales of complexity. Reviews abstraction, encapsulation, inheritance, and interfaces in statically-typed object-oriented languages. Presents a comparative approach to software design patterns and paradigms, including object-oriented and functional programming. Fosters a deeper understanding of the principles of program design, including interface design, test-driven development, graphical design notations, reusable software components, and open-source ecosystems. Illustrates the impact of design-time decisions on software correctness, including accessibility, changeability, performance, reusability and privacy. Students collaborate throughout the semester to design and implement a large software project.
                    </Blockquote.Content>
                </Blockquote.Root>
                <Alert.Root status='warning'>
                    <Alert.Indicator>
                        <LuConstruction />
                    </Alert.Indicator>
                    <Alert.Title>Draft Content</Alert.Title>
                    <Alert.Content>
                        <Alert.Description>
                            This content is a work in progress.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
                <Heading size='lg'>Lecture Overview</Heading>
                <LectureSummary version={pluginData.versions[0].name} />
            </Box>
        </Layout>
    );
}