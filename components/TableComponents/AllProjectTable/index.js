import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

import { useAuth } from "@/navigation/AuthContext/AuthContext";
import { convertToCr } from "@/services/helper";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import SectionCard from "@/components/UI/SectionCard";
import styles from "./styles";

const ProgressWithLabel = ({ label, progress, color }) => (
  <View style={styles.progressBlock}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressValue}>{Math.round(progress * 100)}%</Text>
    </View>
    <Progress.Bar
      progress={progress}
      width={null}
      height={10}
      borderRadius={999}
      color={color}
      unfilledColor="#E6EAF0"
      borderWidth={0}
    />
  </View>
);

const ActionButton = ({ label, color, icon, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    style={[styles.actionButton, { backgroundColor: color }]}
  >
    <FontAwesome5 name={icon} size={14} color="#fff" style={styles.actionIcon} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const HeaderBlock = ({ searchText, setSearchText }) => (
  <View style={styles.headerArea}>
    <Text style={styles.headerTitle}>Sub-Project Overview</Text>
    <Text style={styles.headerSubtitle}>
      Review contract value, live progress, and route actions without layout overlap.
    </Text>

    <View style={styles.searchWrap}>
      <Ionicons name="search" size={18} color="#64748b" />
      <TextInput
        placeholder="Search sub-project..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#94a3b8"
      />
      {searchText.length > 0 ? (
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Ionicons name="close-circle" size={18} color="#94a3b8" />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const AllprojectTable = ({ refresh, handleRefresh, projectData, loading }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText.trim()) {
      return projectData;
    }

    const lower = searchText.toLowerCase();
    return projectData?.filter((item) => item?.name?.toLowerCase().includes(lower));
  }, [projectData, searchText]);

  const renderSkeleton = () =>
    [...Array(4)].map((_, index) => (
      <View key={index} style={styles.skeletonCard}>
        <SkeletonLoader width={"55%"} height={16} style={styles.skeletonGap} />
        <SkeletonLoader width={"92%"} height={14} style={styles.skeletonGap} />
        <SkeletonLoader width={"72%"} height={14} style={styles.skeletonGap} />
        <SkeletonLoader width={"100%"} height={10} style={styles.skeletonGapLg} />
        <SkeletonLoader width={"100%"} height={10} style={styles.skeletonGapLg} />
        <View style={styles.skeletonButtonRow}>
          <SkeletonLoader width={"31%"} height={40} />
          <SkeletonLoader width={"31%"} height={40} />
          <SkeletonLoader width={"31%"} height={40} />
        </View>
      </View>
    ));

  const renderItem = ({ item }) => {
    const expanded = expandedRows[item?.id] || false;
    const showToggle = item?.name?.length > 72;

    return (
      <SectionCard contentStyle={styles.projectCardContent}>
        <View style={styles.projectTitleRow}>
          <View style={styles.projectIconWrap}>
            <FontAwesome name="folder-open" size={14} color="#0b57a4" />
          </View>
          <View style={styles.projectTitleContent}>
            <Text
              style={styles.projectName}
              numberOfLines={expanded ? undefined : 3}
            >
              {item?.name}
            </Text>
            {showToggle ? (
              <TouchableOpacity
                onPress={() =>
                  setExpandedRows((current) => ({
                    ...current,
                    [item?.id]: !current[item?.id],
                  }))
                }
              >
                <Text style={styles.expandText}>
                  {expanded ? "Hide full name ▲" : "View full name ▼"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.metaText}>
            <Text style={styles.metaLabel}>Contract Value: </Text>
            <Text style={styles.metaHighlight}>{convertToCr(item?.contract_value)}</Text>
          </Text>
        </View>

        <ProgressWithLabel
          label="Physical Progress"
          progress={(item?.physical_progress || 0) / 100}
          color="#28a745"
        />
        <ProgressWithLabel
          label="Financial Progress"
          progress={(item?.financial_progress || 0) / 100}
          color="#007BFF"
        />

        <View style={styles.actionGrid}>
          <ActionButton
            label="Financial"
            color="#28a745"
            icon="money-bill-wave"
            onPress={() => navigation.navigate("FinancialScreen", { data: item })}
          />

          <ActionButton
            label="Safeguard"
            color="#f5b400"
            icon="shield-alt"
            onPress={() => navigation.navigate("SafeguardScreen", { data: item })}
          />

          {item?.type_of_procurement === "EPC" ? (
            <ActionButton
              label="EPC"
              color="#007BFF"
              icon="building"
              onPress={() => navigation.navigate("ECPScreen", { data: item })}
            />
          ) : (
            <ActionButton
              label="BOQ"
              color="#17A2B8"
              icon="list-alt"
              onPress={() => navigation.navigate("BOQScreen", { data: item })}
            />
          )}
        </View>
      </SectionCard>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={loading ? [] : filteredData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item?.id || "project"}-${index}`}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <HeaderBlock searchText={searchText} setSearchText={setSearchText} />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonList}>{renderSkeleton()}</View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchText
                  ? "No matching sub-project found."
                  : "No sub-projects available right now."}
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AllprojectTable;
