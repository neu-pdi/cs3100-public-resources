import Layout from '@theme/Layout';
import { Box, Heading, SimpleGrid, VStack, Text, Image, Container, Badge, Link } from '@chakra-ui/react';
import { staffMembers, StaffRole } from '../data/staff';
import { useMemo, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const roleLabels: Record<StaffRole, string> = {
  'instructor': 'Instructor',
  'academic-coordinator': 'Academic Coordinator',
  'ta': 'Teaching Assistant',
};

const roleOrder: StaffRole[] = ['instructor', 'academic-coordinator', 'ta'];

export default function StaffPage() {
  const placeholderUrl = useBaseUrl('/img/staff-placeholder.svg');
  // Detect if we're in development mode (WebP files only exist after build)
  // In dev mode, Docusaurus serves files directly from static/, so we skip WebP
  const isDevMode = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  const groupedStaff = useMemo(() => {
    const grouped: Record<StaffRole, typeof staffMembers> = {
      'instructor': [],
      'academic-coordinator': [],
      'ta': [],
    };

    staffMembers.forEach(member => {
      grouped[member.role].push(member);
    });

    return grouped;
  }, []);

  const hasStaff = staffMembers.length > 0;

  return (
    <Layout title="Staff" description="Meet the CS 3100 Course Staff">
      <Container maxW="container.xl" py={6}>
        <VStack gap={6} align="stretch">
          <Box>
            <Heading size="xl" mb={2}>Course Staff</Heading>
            <Text fontSize="md" color="fg.muted">
              Meet the staff who support CS 3100, including your instructors, academic coordinator, and TAs.
              Our staff are available during office hours to help with assignments, labs, and course concepts.
              Please feel stop by our office hours or post on the Pawtograder discussion forum to say hello!
            </Text>
          </Box>

          {!hasStaff ? (
            <Box p={4} bg="bg.muted" borderRadius="md">
              <Text color="fg.muted" textAlign="center">
                Staff information will be added soon.
              </Text>
            </Box>
          ) : (
            <VStack gap={8} align="stretch">
              {roleOrder.map(role => {
                const members = groupedStaff[role];
                if (members.length === 0) return null;

                // Use more columns for TAs to make them more compact
                const columns = role === 'ta' 
                  ? { base: 2, sm: 3, md: 4, lg: 5, xl: 6 }
                  : { base: 2, md: 4, lg: 4 };

                return (
                  <Box key={role}>
                    <Heading size="md" mb={1}>
                      {roleLabels[role]}
                      {members.length > 1 && `s`}
                    </Heading>
                    <SimpleGrid columns={columns} gap={2}>
                      {members.map((member, index) => {
                        const StaffImage = () => {
                          const [imageError, setImageError] = useState(false);
                          const memberImageUrl = useBaseUrl(`/img/staff/${member.headshot}`);
                          // Skip WebP in dev mode since they're only generated during build
                          // In dev mode, Docusaurus serves files directly from static/, so original images work
                          const hasImageExt = /\.(jpg|jpeg|png)$/i.test(member.headshot);
                          const memberWebpUrl = (!isDevMode && hasImageExt && !imageError)
                            ? useBaseUrl(`/img/staff/${member.headshot.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`)
                            : null;
                          const imageSrc = imageError ? placeholderUrl : memberImageUrl;
                          const webpSrc = imageError ? null : memberWebpUrl;

                          return (
                            <Box
                              as="picture"
                              display="block"
                              borderRadius="full"
                              boxSize={role === 'ta' ? "100px" : "110px"}
                              mx="auto"
                              mb={2}
                              overflow="hidden"
                              bg="bg.muted"
                            >
                              {webpSrc && !imageError && (
                                <source
                                  srcSet={webpSrc}
                                  type="image/webp"
                                />
                              )}
                              <Image
                                src={imageSrc}
                                alt={imageError ? "" : `${member.name} headshot`}
                                borderRadius="full"
                                boxSize={role === 'ta' ? "100px" : "110px"}
                                objectFit={imageError ? "contain" : "cover"}
                                onError={() => setImageError(true)}
                                bg="bg.muted"
                              />
                            </Box>
                          );
                        };

                        return (
                          <Box
                            key={index}
                            p={role === 'ta' ? 2 : 3}
                            bg="bg.surface"
                            borderWidth="1px"
                            borderColor="border.emphasized"
                            borderRadius="md"
                            boxShadow="sm"
                            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                            textAlign="center"
                            mx="auto"
                            w="100%"
                            maxW={role === 'ta' ? "200px" : "none"}
                          >
                            <VStack gap={0} align="stretch">
                              <StaffImage />
                              <Heading size="sm" mb={1}>
                                {member.homepage ? (
                                  <Link href={member.homepage} target="_blank" rel="noopener noreferrer" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                    {member.name}
                                  </Link>
                                ) : (
                                  member.name
                                )}
                              </Heading>
                              {member.pronouns && (
                                <Text fontSize="xs" color="fg.muted" fontStyle="italic" mb={1}>
                                  {member.pronouns}
                                </Text>
                              )}
                              <Text fontSize="xs" color="fg.muted" mb={1}>
                                {member.campus}
                              </Text>
                              <Text 
                                fontSize="xs" 
                                color="fg.muted" 
                                lineHeight="short"
                                mb={1}
                              >
                                {member.bio}
                              </Text>
                              {member.email && (
                                <Link 
                                  href={`mailto:${member.email}`} 
                                  fontSize="xs" 
                                  color="fg.muted" 
                                  _hover={{ textDecoration: 'underline' }}
                                  textAlign="center"
                                  display="block"
                                >
                                  {member.email}
                                </Link>
                              )}
                            </VStack>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Box>
                );
              })}
            </VStack>
          )}
        </VStack>
      </Container>
    </Layout>
  );
}
