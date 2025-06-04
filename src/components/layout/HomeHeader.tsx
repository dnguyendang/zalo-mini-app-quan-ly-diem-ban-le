import React, { FC } from "react";
import { Box } from "zmp-ui";
import styled from "styled-components";
import tw from "twin.macro";

export interface HomeHeaderProps {
    title: string;
    name: string;
}

const HeaderContainer = styled.div`
    ${tw`flex items-center fixed top-0 left-0 w-full px-4 h-[calc(48px + var(--zaui-safe-area-inset-top, 0px))]`};
    z-index: 1;
    background: white;
`;

const HeaderContent = styled.div`
    ${tw`flex items-center gap-3 w-full`};
`;

const LogoWrapper = styled.div`
    width: 48px;
    height: 48px;
    position: relative;
    border-radius: 8px;
    overflow: hidden;
`;

const TextContainer = styled.div`
    ${tw`flex flex-col`};
`;

const Title = styled.h1`
    ${tw`text-lg font-bold text-gray-800 m-0`};
`;

const Subtitle = styled.p`
    ${tw`text-sm text-gray-600 m-0`};
`;

const HomeHeader: FC<HomeHeaderProps> = props => {
    const { title, name } = props;

    return (
        <HeaderContainer>
            <HeaderContent>
                <LogoWrapper>
                    <img 
                        src="/icons/mobifone-logo.png" 
                        alt="MobiFone"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </LogoWrapper>
                <TextContainer>
                    <Title>{title}</Title>
                    <Subtitle>{name}</Subtitle>
                </TextContainer>
            </HeaderContent>
        </HeaderContainer>
    );
};

export default HomeHeader;
